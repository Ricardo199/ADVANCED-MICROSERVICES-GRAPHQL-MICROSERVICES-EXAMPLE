import {schema, model} from 'mongoose';

const productSchema = new schema({
    productName: String,
    productDescription: String,
});

const Product = model('Product', productSchema);

export default Product;