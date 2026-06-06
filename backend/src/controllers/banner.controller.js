import Banner from "../models/Banner.js";

// GET /api/banners  — public (shop fetches this)
export const getBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find({ active: true }).sort({ order: 1, createdAt: 1 });
        res.json(banners);
    } catch (err) { next(err); }
};

// GET /api/banners/all  — admin (includes inactive)
export const getAllBanners = async (req, res, next) => {
    try {
        const banners = await Banner.find().sort({ order: 1, createdAt: 1 });
        res.json(banners);
    } catch (err) { next(err); }
};

// POST /api/banners/upload-image  — admin, Cloudinary
export const uploadBannerImage = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file provided" });
        res.json({ url: req.file.path });
    } catch (err) { next(err); }
};

// POST /api/banners  — admin
export const createBanner = async (req, res, next) => {
    try {
        const banner = await Banner.create(req.body);
        res.status(201).json(banner);
    } catch (err) { next(err); }
};

// PUT /api/banners/:id  — admin
export const updateBanner = async (req, res, next) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!banner) return res.status(404).json({ message: "Banner not found" });
        res.json(banner);
    } catch (err) { next(err); }
};

// DELETE /api/banners/:id  — admin
export const deleteBanner = async (req, res, next) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) { next(err); }
};
