
import fetch from 'node-fetch';
import { ffmpeg } from '../lib/converter.js';

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!/audio|video/.test(mime)) throw `Reply to an audio or video file with ${usedPrefix + command}`;
    
    m.reply('Wait a moment, I\'m listening to the song...');
    
    try {
        let media = await q.download();
        let ext = mime.split('/')[1];

        let audio = await ffmpeg(media, [
            '-vn',
            '-c:a', 'libmp3lame',
            '-b:a', '128k',
            '-ac', '2',
            '-ar', '44100'
        ], ext, 'mp3');
        media = audio.data;

        const MAX_SIZE = 70 * 1024; 
        if (media.length > MAX_SIZE) {
            media = media.subarray(0, MAX_SIZE);
        }

        let base64Data = media.toString('base64');
        
        const response = await fetch('https://whatmusic.ryzecodes.xyz/whatmusic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: 'sample.mp3',
                b64: base64Data
            })
        });

        if (!response.ok) {
            throw new Error(`API responded with ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('WhatMusic Response:', data);

        if (data && (data.success || data.status) && (data.song || data.track || data.metadata)) {
            let res = data.song || data.track || data.metadata;
            let raw = data.raw || {};
            let track = raw.track || {};

            let txt = `🎵 *Music Recognition Found* 🎵\n\n`;
            txt += `🎤 *Artist:* ${res.artist || track.subtitle || 'Unknown'}\n`;
            txt += `🎼 *Title:* ${res.title || track.title || 'Unknown'}\n`;
            if (res.album) txt += `💿 *Album:* ${res.album}\n`;
            
            let releaseDate = res.releaseDate || res.release_date || track.releasedate;
            let label = res.label;
            let isrc = track.isrc;
            let genre = res.genre || (track.genres && track.genres.primary);
            
            if (track.sections) {
                let metaSection = track.sections.find(s => s.type === 'SONG' || s.metadata);
                if (metaSection && metaSection.metadata) {
                    if (!releaseDate) {
                        let rel = metaSection.metadata.find(m => m.title === 'Released');
                        if (rel) releaseDate = rel.text;
                    }
                    if (!label) {
                        let lab = metaSection.metadata.find(m => m.title === 'Label');
                        if (lab) label = lab.text;
                    }
                }
            }

            if (releaseDate) txt += `📅 *Release Date:* ${releaseDate}\n`;
            if (genre) txt += `🎼 *Genre:* ${genre}\n`;
            if (label) txt += `🏷️ *Label:* ${label}\n`;
            if (isrc) txt += `🆔 *ISRC:* ${isrc}\n`;
            
            let spotify = res.spotify;
            let youtube = res.youtube;
            let deezer = null;
            let apple = res.appleMusicUrl;

            if (track.hub && track.hub.providers) {
                let p = track.hub.providers;
                
                if (!spotify) {
                    let spot = p.find(x => x.type === 'SPOTIFY');
                    if (spot && spot.actions && spot.actions[0] && spot.actions[0].uri && spot.actions[0].uri.startsWith('http')) {
                        spotify = spot.actions[0].uri;
                    }
                }
                
                if (!youtube) {
                    let yt = p.find(x => x.type === 'YOUTUBEMUSIC');
                    if (yt && yt.actions && yt.actions[0] && yt.actions[0].uri && yt.actions[0].uri.startsWith('http')) {
                        youtube = yt.actions[0].uri;
                    }
                }

                let deez = p.find(x => x.type === 'DEEZER');
                if (deez && deez.actions && deez.actions[0] && deez.actions[0].uri && deez.actions[0].uri.startsWith('http')) {
                    deezer = deez.actions[0].uri;
                }
            }
            
            txt += `\n`;

            if (spotify) txt += `\n🟢 *Spotify:* ${spotify}`;
            if (youtube) {
                let ytLabel = youtube.includes('music.youtube.com') ? '*YouTube Music:*' : '*YouTube:*';
                txt += `\n🔴 ${ytLabel} ${youtube}`;
            }
            if (deezer) txt += `\n🟣 *Deezer:* ${deezer}`;
            if (apple) txt += `\n🍎 *Apple Music:* ${apple}`;
            
            if (res.shazamUrl) txt += `\n⚡ *Shazam:* ${res.shazamUrl}`;
            
            let cover = res.coverArt || res.coverImage;
            if (cover) {
                await conn.sendMessage(m.chat, { image: { url: cover }, caption: txt }, { quoted: m });
            } else {
                await conn.reply(m.chat, txt, m);
            }
        } else {
             let errorMsg = `Could not identify the song.`;
             if (data && (data.message || data.error)) errorMsg += `\nMessage: ${data.message || data.error}`;
             await conn.reply(m.chat, errorMsg, m);
        }

    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `Error identifying song: ${e.message}`, m);
    }
};

handler.help = ['whatmusic', 'shazam'];
handler.tags = ['tools'];
handler.command = /^(whatmusic|shazam|findsong)$/i;

export default handler;
