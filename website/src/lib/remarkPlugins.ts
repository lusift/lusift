import remarkSlug from 'remark-slug';
import autoLinkHeadings from 'remark-autolink-headings';
import remarkToc from 'remark-toc';
import emoji from 'remark-emoji';
import footnotes from 'remark-footnotes';
import remarkImages from 'remark-images';

const plugins = [
  // remarkSlug,
  // autoLinkHeadings,
  /* [
    autoLinkHeadings,
    {
      behavior: 'append',
      linkProperties: {
        class: ['anchor'],
        title: 'Direct link to heading',
      },
    },
  ], */
  /* [
    remarkToc,
    {
      skip: 'Reference',
      maxDepth: 6,
    },
  ], */
  emoji,
  footnotes,
  remarkImages,
];

export default plugins;
