const Poem = require('../models/poem'); 
const Poet = require('../models/poet'); 

exports.generateSitemap = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/xml');

    const poems = await Poem.find({}, '_id');
    const poets = await Poet.find({}, '_id');

    const poemUrls = poems.map(p => `
      <url>
        <loc>https://sukhan-pi.vercel.app/poems/${p._id}</loc>
      </url>
    `).join('');

    const poetUrls = poets.map(p => `
      <url>
        <loc>https://sukhan-pi.vercel.app/poets/${p._id}</loc>
      </url>
    `).join('');

    const urls = poemUrls + poetUrls;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
      </urlset>`;

    res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
};
