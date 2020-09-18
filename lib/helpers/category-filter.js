const nameFilter = (shopifyTopicCategories = []) => {
  return (cat) => !shopifyTopicCategories.includes(cat.title);
};

const extractData = (cat, injections = {}) => ({
  shopifyId: cat.id,
  name: cat.title,
  products: cat.product_count,
  description: cat.descriptionHtml,
});

export default (data, shopifyTopicCategories) =>
  data.filter(nameFilter(shopifyTopicCategories)).map(extractData);
