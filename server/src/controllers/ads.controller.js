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
        imageUrl: "/images/ad-dukes-bar-grill.webp",
        link: "https://geni.us/oneweekendmontana",
        alt: "Duke's Bar & Grill Ad"
      },
      {
        id: 2,
        imageUrl: "/images/ad-grindhouse-coffee-shop.webp",
        link: "https://geni.us/campuscrush",
        alt: "The Grindhouse Coffee Shop Ad"
      },
      {
        id: 3,
        imageUrl: "/images/ad-la-wolves-football.webp",
        link: "https://geni.us/defendingthebackfield",
        alt: "LA Wolves Football Ad"
      }
    ];

    res.status(200).json(ads);
  } catch (err) {
    logger.error("Error fetching ads:", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Failed to fetch ads" });
  }
};

export { getAds };
