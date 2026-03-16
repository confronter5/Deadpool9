/**
 * Create By Confronter
 * Modified for Heroku Deployment
 */

const fs = require('fs')
const { tmpdir } = require("os")
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")
const path = require("path")

// Ensure tmp directory exists
const tmpDir = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
}

// Use system FFmpeg
const ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg'
ff.setFfmpegPath(ffmpegPath)

async function imageToWebp(media) {
    const tmpFileOut = path.join(__dirname, `../tmp/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(__dirname, `../tmp/${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)

    fs.writeFileSync(tmpFileIn, media)

    try {
        await new Promise((resolve, reject) => {
            ff(tmpFileIn)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`])
                .toFormat('webp')
                .save(tmpFileOut)
        })

        const buff = fs.readFileSync(tmpFileOut)
        fs.unlinkSync(tmpFileOut)
        fs.unlinkSync(tmpFileIn)
        return buff
    } catch (error) {
        if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut)
        if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn)
        throw error
    }
}

async function videoToWebp(media) {
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)

    fs.writeFileSync(tmpFileIn, media)

    try {
        await new Promise((resolve, reject) => {
            ff(tmpFileIn)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`])
                .toFormat('webp')
                .save(tmpFileOut)
        })

        const buff = fs.readFileSync(tmpFileOut)
        fs.unlinkSync(tmpFileOut)
        fs.unlinkSync(tmpFileIn)
        return buff
    } catch (error) {
        if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut)
        if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn)
        throw error
    }
}

async function writeExifImg(media, metadata) {
    let wMedia = await imageToWebp(media)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    
    try {
        fs.writeFileSync(tmpFileIn, wMedia)

        if (metadata.packname || metadata.author) {
            const img = new webp.Image()
            const json = { 
                "sticker-pack-id": `https://github.com/confronter5/Deadpool9`, 
                "sticker-pack-name": metadata.packname, 
                "sticker-pack-publisher": metadata.author, 
                "emojis": metadata.categories ? metadata.categories : [""] 
            }
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
            const exif = Buffer.concat([exifAttr, jsonBuff])
            exif.writeUIntLE(jsonBuff.length, 14, 4)
            await img.load(tmpFileIn)
            img.exif = exif
            await img.save(tmpFileOut)
            
            const result = fs.readFileSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            fs.unlinkSync(tmpFileOut)
            return result
        }
    } catch (error) {
        if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn)
        if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut)
        throw error
    }
}

async function writeExifVid(media, metadata) {
    let wMedia = await videoToWebp(media)
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    
    try {
        fs.writeFileSync(tmpFileIn, wMedia)

        if (metadata.packname || metadata.author) {
            const img = new webp.Image()
            const json = { 
                "sticker-pack-id": `https://github.com/confronter5/Deadpool9`, 
                "sticker-pack-name": metadata.packname, 
                "sticker-pack-publisher": metadata.author, 
                "emojis": metadata.categories ? metadata.categories : [""] 
            }
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
            const exif = Buffer.concat([exifAttr, jsonBuff])
            exif.writeUIntLE(jsonBuff.length, 14, 4)
            await img.load(tmpFileIn)
            img.exif = exif
            await img.save(tmpFileOut)
            
            const result = fs.readFileSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            fs.unlinkSync(tmpFileOut)
            return result
        }
    } catch (error) {
        if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn)
        if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut)
        throw error
    }
}

async function writeExif(media, metadata) {
    let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""
    const tmpFileIn = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    const tmpFileOut = path.join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
    
    try {
        fs.writeFileSync(tmpFileIn, wMedia)

        if (metadata.packname || metadata.author) {
            const img = new webp.Image()
            const json = { 
                "sticker-pack-id": `https://github.com/confronter5/Deadpool9`, 
                "sticker-pack-name": metadata.packname, 
                "sticker-pack-publisher": metadata.author, 
                "emojis": metadata.categories ? metadata.categories : [""] 
            }
            const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
            const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
            const exif = Buffer.concat([exifAttr, jsonBuff])
            exif.writeUIntLE(jsonBuff.length, 14, 4)
            await img.load(tmpFileIn)
            img.exif = exif
            await img.save(tmpFileOut)
            
            const result = fs.readFileSync(tmpFileOut)
            fs.unlinkSync(tmpFileIn)
            fs.unlinkSync(tmpFileOut)
            return result
        }
    } catch (error) {
        if (fs.existsSync(tmpFileIn)) fs.unlinkSync(tmpFileIn)
        if (fs.existsSync(tmpFileOut)) fs.unlinkSync(tmpFileOut)
        throw error
    }
}

module.exports = { imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif }
