import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { envs } from './config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongoUri, {
      dbName: envs.mongoDbName,
    }),
    UsersModule,
    AuthModule,
    OrdersModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
