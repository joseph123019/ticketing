import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@jemtickets/common';

interface OrderAttrs {
  id: string;
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  price: number;
  status: OrderStatus;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret._id;
      },
      virtuals: true, // will add id after we delete _id
      versionKey: false,
      useProjection: true, // this will work with select option on the schema
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
    version: attrs.version,
  });
};
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
