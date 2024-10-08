import { Schema, model } from "mongoose";
import { Products } from "../interfaces/product";

const productsSchema: Schema = new Schema<Products>({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
  price: { type: Number, required: true, min: 1, max: 1000000 },
  priceAfterDiscount: { type: Number, min: 1, max: 1000000 },
  quantity: { type: Number, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, default: 0 },
  cover: String,
  images: [String],
  category: { type: Schema.Types.ObjectId, required: true, ref: 'categories' },
  subcategory: { type: Schema.Types.ObjectId, required: true, ref: 'subCategories' }
}, { timestamps: true });
//productsSchema.virtual('reviews', { ref: 'reviews', foreignField: 'product', localField: '_id' })

productsSchema.pre<Products>(/^find/, function (next) {
  this.populate({ path:'category', select: 'name' })
  this.populate({ path:'subcategory', select: 'name' })
  next()
})

const imageUrl = (document: Products) => {
  if (document.cover) {
    const imageUrl: string = `${process.env.BASE_URL}/product/${document.cover}`;
    document.cover = imageUrl;
  }
  if (document.images) {
    const imageList: string[] = [];
    document.images.forEach(image => {
      const imageUrl: string = `${process.env.BASE_URL}/product/${image}`
      imageList.push(imageUrl);
    });
    document.images = imageList;
  }
}

productsSchema
  .post('init', (document: Products) => { imageUrl(document) })
  .post('save', (document: Products) => { imageUrl(document) })


export default model<Products>('products', productsSchema)