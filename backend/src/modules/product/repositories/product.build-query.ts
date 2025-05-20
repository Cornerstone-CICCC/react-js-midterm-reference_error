import { SearchCriteria } from "./product.repository.interfaces";

export async function buildWhereQuery(criteria: SearchCriteria) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const where: any = {};

  // Partial matching search for title
  if (criteria.title) {
    where.title = {
      contains: criteria.title,
    };
  }

  // Partial matching search for description
  if (criteria.description) {
    where.description = {
      contains: criteria.description,
    };
  }

  // Price range search
  if (criteria.priceRange) {
    where.price = {
      gte: criteria.priceRange.min,
      lte: criteria.priceRange.max,
    };
  }

  // Category search
  if (criteria.category) {
    where.category = criteria.category;
  }

  // Condition search
  if (criteria.condition) {
    where.condition = criteria.condition;
  }

  // Status search
  if (criteria.status) {
    where.status = criteria.status;
  }

  // CreatedAt range search
  if (criteria.createdAtRange) {
    where.createdAt = {
      gte: criteria.createdAtRange.start,
      lte: criteria.createdAtRange.end,
    };
  }

  return where;
}
