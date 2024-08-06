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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const og_1 = __importDefault(require("./utils/og"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, body_parser_1.json)());
// Route to generate OG image
app.post('/api/generate-og-image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postData = req.body;
        if (!postData.id || !postData.title || !postData.content) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const imageBuffer = yield (0, og_1.default)(postData);
        res.set('Transfer-Encoding', 'chunked');
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    }
    catch (error) {
        console.error('Error generating OG image:', error);
        res.status(500).json({ error: 'Failed to generate OG image' });
    }
}));
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
exports.default = app;
