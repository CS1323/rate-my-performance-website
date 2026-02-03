/**
 * Ads Controller
 * Handles ad data retrieval
 */

/**
 * Get all ads
 */
const getAds = async (req, res) => {
  try {
    // Return hardcoded ads with images served from /images
    const ads = [
      {
        id: 1,
        imageUrl: "/images/dukes-ad.png",
        link: "",
        alt: "Duke's Ad"
      }
    ];

    res.status(200).json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ads" });
  }
};

export { getAds };
