const chai = require('chai');
const chaiHttp = require('chai-http');
const supertest = require('supertest');
const app = require('../app.js'); 
const fs = require('fs');
const path = require('path');
const expect = chai.expect;
chai.use(chaiHttp);

describe('SVG Endpoint Tests', function() {
    // Helper function to read SVG files
    const readSvgFile = (fileName) => {
        const filePath = path.join(__dirname, '..', `${fileName}.svg`);
        return fs.readFileSync(filePath, 'utf8');
    };

    it('should return modified i.svg', function(done) {
        supertest(app)
            .get('/i.svg')
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
                expect(res.headers['content-type']).to.equal('image/svg+xml; charset=utf-8');

                const svgContent = readSvgFile('i');
                const modifiedSvg = svgContent
                    .replace(/\.cls-8\s*\{[^\}]*\}/g, `.cls-8 { opacity: `)
                    .replace(/\.cls-9\s*\{[^\}]*\}/g, `.cls-9 { opacity: `);

                expect(res.text).to.include('.cls-8 { opacity: ');
                expect(res.text).to.include('.cls-9 { opacity: ');
                done();
            });
    });

    it('should return modified ii.svg', function(done) {
        supertest(app)
            .get('/ii.svg')
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
                expect(res.headers['content-type']).to.equal('image/svg+xml; charset=utf-8');

                const svgContent = readSvgFile('ii');
                const modifiedSvg = svgContent
                    .replace(/\.cls-8\s*\{[^\}]*\}/g, `.cls-8 { opacity: `)
                    .replace(/\.cls-9\s*\{[^\}]*\}/g, `.cls-9 { opacity: `);

                expect(res.text).to.include('.cls-8 { opacity: ');
                expect(res.text).to.include('.cls-9 { opacity: ');
                done();
            });
    });

    it('should return modified iii.svg', function(done) {
        supertest(app)
            .get('/iii.svg')
            .end((err, res) => {
                if (err) return done(err);
                expect(res).to.have.status(200);
                expect(res).to.be.an('object');
                expect(res.headers['content-type']).to.equal('image/svg+xml; charset=utf-8');

                const svgContent = readSvgFile('iii');
                const modifiedSvg = svgContent
                    .replace(/\.cls-8\s*\{[^\}]*\}/g, `.cls-8 { opacity: `)
                    .replace(/\.cls-9\s*\{[^\}]*\}/g, `.cls-9 { opacity: `);

                expect(res.text).to.include('.cls-8 { opacity: ');
                expect(res.text).to.include('.cls-9 { opacity: ');
                done();
            });
    });

    it('should return 404 for non-existent file', function(done) {
        supertest(app)
            .get('/nonexistent.svg')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.text).to.equal('File not found.');
                done();
            });
    });
});
