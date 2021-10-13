import prisma from '../../prisma';
import { Prisma } from '@prisma/client';

const getReviewsByRating = async (id, offset, limit = 10) => {
  let reviews = [];

  return (reviews = await prisma.$queryRaw`
  SELECT reviews.id, users.username, reviews.product_id, products.id, products.name,
  reviews.rating, reviews.content, reviews.created_at, reviews.updated_at, review_images.image_url
  FROM reviews
  LEFT JOIN review_images ON reviews.id = review_images.review_id
  LEFT JOIN users ON reviews.user_id = users.id
  LEFT JOIN products ON reviews.product_id = products.id
  WHERE reviews.product_id=${id}
  ORDER BY rating DESC
  LIMIT ${limit}
  ${offset ? Prisma.sql`OFFSET ${offset}` : Prisma.empty};
  `);
};

const getReviews = async (id, offset, limit = 10) => {
  let reviews = [];
  return (reviews = await prisma.$queryRaw`
  SELECT reviews.id, users.username, reviews.product_id, products.id, products.name,
  reviews.rating, reviews.content, reviews.created_at, reviews.updated_at, review_images.image_url
  FROM reviews
  LEFT JOIN review_images ON reviews.id = review_images.review_id
  LEFT JOIN users ON reviews.user_id = users.id
  LEFT JOIN products ON reviews.product_id = products.id
  WHERE reviews.product_id=${id}
  ORDER BY created_at DESC
  LIMIT ${limit}
  ${offset ? Prisma.sql`OFFSET ${offset}` : Prisma.empty};
  `);
};

export default { getReviews, getReviewsByRating };

const createReview = async (userId, productId, rating, content) => {
  await prisma.$queryRaw`
  INSERT INTO reviews VALUES
  (
              DEFAULT,
              ${userId},
              ${productId},
              ${rating},
              ${content},
              DEFAULT,
              DEFAULT
  );
    `;

  return await prisma.$queryRaw`
  SELECT 
    id,
    user_id,
    product_id,
    rating,
    content,
    created_at,
    updated_at
  FROM   reviews
  ORDER  BY id DESC
  LIMIT  1;  
    `;
};

const createReviewImg = async (imgUrl, reviewId) => {
  await prisma.$queryRaw`
  INSERT INTO review_images VALUES
  (
              DEFAULT,
              ${reviewId},
              ${imgUrl}
  );
  `;

  return await prisma.$queryRaw`
  SELECT 
  FROM   reviews
         LEFT JOIN review_images
                ON reviews.id = review_images.review_id
  ORDER  BY reviews.id DESC
  LIMIT  1; 
  `;
};

export default { createReview, createReviewImg };
