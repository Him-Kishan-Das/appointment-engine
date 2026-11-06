import { Tenant } from '../models/Tenant.js';

export const tenantContext = async (req, res, next) => {
  try {
    // 1. Resolve tenant identifier from headers, route params, or query string
    const slug = 
      req.headers['x-tenant-slug'] || 
      req.params.tenantSlug || 
      req.query.tenant;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Tenant context missing. Provide a valid "x-tenant-slug" header or parameter.',
      });
    }

    // 2. Fetch tenant from database
    const tenant = await Tenant.findOne({ slug: slug.toLowerCase().trim() });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: `Tenant "${slug}" not found or inactive.`,
      });
    }

    // 3. Attach tenant context to the request pipeline
    req.tenant = tenant;
    next();
  } catch (error) {
    next(error);
  }
};