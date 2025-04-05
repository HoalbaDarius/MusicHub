import React, { useState } from 'react';
import Card from '../Card/Card';
import ThemeCarousel, { StyleThemeOption } from '../ThemeCarousel/ThemeCarousel';
import MerchModal, { MerchItem } from '../MerchModal/MerchModal';
import ArtistModal, { ArtistItem } from '../ArtistModal/ArtistModal';
import { SongPreview } from '../../App';
import './MainScreen.css';

interface Item {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'music' | 'merch' | 'artist';
  link?: string;
  songUrl?: string;
}

const featuredMusic: Item[] = [
  { 
    id: 'm1', 
    title: 'Under Pressure', 
    description: 'Logic', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Logic_-_Under_Pressure_%28Deluxe_Edition%29.jpg/220px-Logic_-_Under_Pressure_%28Deluxe_Edition%29.jpg', 
    type: 'music', 
    link: '#',
    songUrl: '/UnderPressure.mp3'
  },
  { 
    id: 'm2', 
    title: 'Blinding Lights', 
    description: 'The Weeknd', 
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png', 
    type: 'music', 
    link: '#',
    songUrl: 'https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3' // External URL as fallback
  },
  { 
    id: 'm3', 
    title: 'bad guy', 
    description: 'Billie Eilish', 
    imageUrl: 'https://www.billboard.com/wp-content/uploads/media/Billie-Eilish-Bad-Guy-screenshot-2019-billboard-1500.jpg', 
    type: 'music', 
    link: '#',
    songUrl: 'https://cdn.freesound.org/previews/392/392617_5121236-lq.mp3' // External URL as fallback
  },
];

// Enhanced merch items with additional details needed for the modal
const latestMerch: MerchItem[] = [
  { 
    id: 'me1', 
    title: 'Band Logo T-Shirt', 
    description: 'Official band merch with premium quality cotton and custom printing. Perfect for concerts and everyday wear.', 
    imageUrl: 'https://storage.googleapis.com/pr-newsroom-wp/1/2023/10/SPOTIFY-X-FC-BARCELONA-X-ROLLING-STONES-8-1440x1280.jpg', 
    type: 'merch',
    price: '$24.99',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Red']
  },
  { 
    id: 'me2', 
    title: 'Signed Vinyl Record', 
    description: 'Limited Edition vinyl record personally signed by the artist. Includes digital download code and exclusive artwork.', 
    imageUrl: 'https://www.gunitbrands.com/cdn/shop/products/signed_VinylCovercopy2_2048x.jpg?v=1672942697', 
    type: 'merch',
    price: '$59.99',
    variants: ['Standard Edition', 'Collector\'s Edition']
  },
  { 
    id: 'me3', 
    title: 'Enamel Pin Set', 
    description: 'Set of 5 high-quality enamel pins featuring iconic album art. Perfect for jackets, bags, and lanyards.', 
    imageUrl: 'https://shop.jbonamassa.com/cdn/shop/products/store-image-1-72r7y.jpg?v=1476203860', 
    type: 'merch',
    price: '$18.99',
    colors: ['Gold', 'Silver', 'Multi-color']
  },
];
 
const artistRecommendations: ArtistItem[] = [
  { 
    id: 'a1', 
    title: 'Marko Glass', 
    description: 'Genre: Urban Trap', 
    imageUrl: 'https://images.genius.com/199959a75bd7b76d5c81e92018402658.1000x1000x1.png', 
    type: 'artist', 
    link: '#',
    monthlyListeners: '3.2M',
    followers: '2.5M',
    albumsCount: 3,
    bio: 'Marko Glass is a rising star in the Urban Trap scene, known for his innovative beats and thought-provoking lyrics. With a unique production style that blends traditional trap elements with experimental sounds, he has quickly gained a dedicated following worldwide.',
    popularSongs: [
      {
        id: 'marko-song-1',
        title: 'City Lights',
        album: 'Urban Vision',
        duration: '3:24',
        streams: '15.7M',
        coverImage: 'https://i.scdn.co/image/ab67616d0000b273af52c228c9619ff6298b08cd',
        songUrl: 'https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3'
      },
      {
        id: 'marko-song-2',
        title: 'Night Drive',
        album: 'Urban Vision',
        duration: '4:02',
        streams: '10.3M',
        coverImage: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a'
      },
      {
        id: 'marko-song-3',
        title: 'Visions',
        album: 'Glass World',
        duration: '3:18',
        streams: '8.9M',
        coverImage: 'https://i.scdn.co/image/ab67616d0000b273ba718c57dd246f7c3d3e103f'
      }
    ]
  },
  { 
    id: 'a2', 
    title: 'BTS', 
    description: 'Genre: K-Pop', 
    imageUrl: 'https://i1.wp.com/stephanieeffevottu.com/wp-content/uploads/2023/06/20230609_100516.jpg?fit=1200%2C800&ssl=1', 
    type: 'artist', 
    link: '#',
    monthlyListeners: '32.8M',
    followers: '45.6M',
    albumsCount: 9,
    bio: 'BTS, also known as the Bangtan Boys, is a seven-member South Korean boy band that has been redefining the global music scene since their debut. With their meaningful lyrics, impressive choreography, and genuine connection with fans, BTS has transcended cultural and language barriers to become one of the most influential musical acts in the world.',
    popularSongs: [
      {
        id: 'bts-song-1',
        title: 'Dynamite',
        album: 'BE',
        duration: '3:19',
        streams: '1.3B',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/c/c0/BTS_-_Dynamite_%28official_cover%29.png',
        songUrl: 'https://cdn.freesound.org/previews/392/392617_5121236-lq.mp3'
      },
      {
        id: 'bts-song-2',
        title: 'Butter',
        album: 'Butter',
        duration: '2:42',
        streams: '980M',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/d/db/BTS_-_Butter.png'
      },
      {
        id: 'bts-song-3',
        title: 'Boy With Luv',
        album: 'Map of the Soul: Persona',
        duration: '3:49',
        streams: '720M',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/9/9e/BTS_-_Map_of_the_Soul_-_Persona.png'
      }
    ]
  },
  { 
    id: 'a3', 
    title: 'Slipknot', 
    description: 'Genre: Rock', 
    imageUrl: 'https://i8.amplience.net/i/naras/slipknot_MI0005599206-MN0000750742', 
    type: 'artist', 
    link: '#',
    monthlyListeners: '12.5M',
    followers: '15.3M',
    albumsCount: 7,
    bio: 'Slipknot is an American heavy metal band formed in Des Moines, Iowa, in 1995. Known for their aggressive style of music, chaotic live shows, and distinctive image featuring masks and matching jumpsuits, they have established themselves as one of the most influential bands in the metal genre.',
    popularSongs: [
      {
        id: 'slipknot-song-1',
        title: 'Duality',
        album: 'Vol. 3: (The Subliminal Verses)',
        duration: '4:12',
        streams: '320M',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Slipknot_-_Vol._3-_%28The_Subliminal_Verses%29.jpg'
      },
      {
        id: 'slipknot-song-2',
        title: 'Psychosocial',
        album: 'All Hope Is Gone',
        duration: '4:43',
        streams: '280M',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/4/42/Slipknot_-_All_Hope_Is_Gone.jpeg'
      },
      {
        id: 'slipknot-song-3',
        title: 'Before I Forget',
        album: 'Vol. 3: (The Subliminal Verses)',
        duration: '4:38',
        streams: '210M',
        coverImage: 'https://upload.wikimedia.org/wikipedia/en/f/f3/Slipknot_-_Vol._3-_%28The_Subliminal_Verses%29.jpg',
        songUrl: 'https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3'
      }
    ]
  },
];

interface MainScreenProps {
    theme: 'light' | 'dark';
    styleThemes: StyleThemeOption[];
    currentStyleTheme: string;
    onStyleThemeChange: (themeId: string) => void;
    imgBanner: string;
    onPreviewSong: (song: SongPreview) => void;
}

const MainScreen: React.FC<MainScreenProps> = ({
    theme,
    styleThemes,
    currentStyleTheme,
    onStyleThemeChange,
    imgBanner,
    onPreviewSong
}) => {
  // State for the merch modal
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for the artist modal
  const [selectedArtist, setSelectedArtist] = useState<ArtistItem | null>(null);
  const [isArtistModalOpen, setIsArtistModalOpen] = useState(false);

  const handleCardClick = (item: Item | MerchItem | ArtistItem, event: React.MouseEvent) => {
    event.preventDefault();
    
    if (item.type === 'music' && 'songUrl' in item && item.songUrl) {
      onPreviewSong({
        songUrl: item.songUrl,
        songTitle: item.title,
        artistName: item.description,
        coverImage: item.imageUrl
      });
    } else if (item.type === 'merch') {
      // Open the modal for merch items
      setSelectedMerch(item as MerchItem);
      setIsModalOpen(true);
    } else if (item.type === 'artist') {
      // Open the modal for artist items
      setSelectedArtist(item as ArtistItem);
      setIsArtistModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMerch(null), 300); // Clear item after animation finishes
  };

  const handleCloseArtistModal = () => {
    setIsArtistModalOpen(false);
    setTimeout(() => setSelectedArtist(null), 300); // Clear item after animation finishes
  };

  return (
    <> 
        {/* 1. Banner Section */}
        <section className="banner-section" style={{ backgroundImage: 'url(' + imgBanner + ')' }}>
            <div className="banner-overlay"></div>
            <div className="banner-content">
                <h1 className="banner-title">
                    Drop Music
                    <br />
                    Like Never Before
                </h1>
                <p className="banner-subtitle">Discover, Connect, Collect.</p>
            </div>
        </section>

        {/* 2. Short Description Section */}
        <section className="description-section content-section">
            <h2 className="section-title">What We Vibe To</h2>
            <p className="description-text">
                MusicHub is the nexus for groundbreaking sounds and authentic artist connections.
                Dive into curated streams, snag limited-edition merch drops, and explore the frontiers
                of music discovery. Your next obsession awaits.
            </p>
        </section>

        {/* 3. Theme Style Carousel Section */}
        <section className="content-section theme-carousel-section">
            <ThemeCarousel
                themes={styleThemes}
                currentStyleTheme={currentStyleTheme}
                onThemeChange={onStyleThemeChange}
             />
        </section>

        {/* --- Existing Card Sections Wrapped in Main --- */}
        <main className="main-content-cards">
            {/* Section for Featured Music */}
            <section id="music" className="content-section">
                <h2 className="section-title">Featured Music</h2>
                <div className="card-grid">
                {featuredMusic.map(item => (
                    <Card
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.imageUrl}
                        type={item.type}
                        link={item.link || '#'}
                        onClick={(e) => handleCardClick(item, e)}
                    />
                ))}
                </div>
            </section>

            {/* Section for Latest Merch */}
            <section id="merch" className="content-section">
                <h2 className="section-title">Latest Merch</h2>
                <div className="card-grid">
                {latestMerch.map(item => (
                    <Card
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.imageUrl}
                        type={item.type}
                        link="#"
                        onClick={(e) => handleCardClick(item, e)}
                    />
                ))}
                </div>
            </section>

            {/* Section for Artist Recommendations */}
            <section id="recommendations" className="content-section">
                <h2 className="section-title">Discover Artists</h2>
                <div className="card-grid">
                {artistRecommendations.map(item => (
                    <Card
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        imageUrl={item.imageUrl}
                        type={item.type}
                        link={item.link || '#'}
                        onClick={(e) => handleCardClick(item, e)}
                    />
                ))}
                </div>
            </section>
        </main>

        {/* Merch Modal */}
        {selectedMerch && (
          <MerchModal
            item={selectedMerch}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}

        {/* Artist Modal */}
        {selectedArtist && (
          <ArtistModal
            artist={selectedArtist}
            isOpen={isArtistModalOpen}
            onClose={handleCloseArtistModal}
            onPreviewSong={onPreviewSong}
          />
        )}
    </>
  );
};

export default MainScreen;