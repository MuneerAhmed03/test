"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const defaultOptions = {
    width: 1200,
    height: 630,
    backgroundColor: '#f0f0f0',
    titleColor: '#333333',
    contentColor: '#666666',
    titleFont: 'bold 40px Arial',
    contentFont: '24px Arial',
    logoPath: '',
};
function generateOGImage(post, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const opts = Object.assign(Object.assign({}, defaultOptions), options);
        const canvas = (0, canvas_1.createCanvas)(opts.width, opts.height);
        const ctx = canvas.getContext('2d');
        // Set background
        ctx.fillStyle = opts.backgroundColor;
        ctx.fillRect(0, 0, opts.width, opts.height);
        // Add logo
        //   await addLogo(ctx, opts.logoPath);
        // Add title
        addText(ctx, post.title, 50, 200, opts.titleFont, opts.titleColor, 1100);
        // Add content snippet
        const contentSnippet = post.content.substring(0, 100) + '...';
        addText(ctx, contentSnippet, 50, 250, opts.contentFont, opts.contentColor, 1100);
        // Add image if available
        if (post.image) {
            yield addPostImage(ctx, post.image);
        }
        // Return the buffer
        return canvas.toBuffer('image/png');
    });
}
function addLogo(ctx, logoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const logo = yield (0, canvas_1.loadImage)(logoPath);
        ctx.drawImage(logo, 50, 50, 100, 100);
    });
}
function addText(ctx, text, x, y, font, color, maxWidth) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y, maxWidth);
}
function addPostImage(ctx, imagePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, canvas_1.loadImage)(imagePath);
        ctx.drawImage(image, 600, 300, 550, 280);
    });
}
exports.default = generateOGImage;
