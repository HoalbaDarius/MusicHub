import React from "react";
import "./ArtistModal.css";
import { X, Play } from "lucide-react";
import { SongPreview } from "../../App";

export interface ArtistItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "artist";
  link?: string;
  monthlyListeners?: string;
  followers?: string;
  albumsCount?: number;
  bio?: string;
  popularSongs?: Array<{
    id: string;
    title: string;
    album: string;
    duration: string;
    streams: string;
    coverImage: string;
    songUrl?: string;
  }>;
  relatedArtists?: Array<{
    id: string;
    name: string;
    imageUrl: string;
  }>;
}

interface ArtistModalProps {
  artist: ArtistItem;
  isOpen: boolean;
  onClose: () => void;
  onPreviewSong?: (song: SongPreview) => void;
}

const ArtistModal: React.FC<ArtistModalProps> = ({
  artist,
  isOpen,
  onClose,
  onPreviewSong,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close modal when clicking outside (on the backdrop)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePreviewSong = (song: any) => {
    if (onPreviewSong) {
      onPreviewSong({
        songUrl:
          song.songUrl ||
          "https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3", // Default song URL if none provided
        songTitle: song.title,
        artistName: artist.title,
        coverImage: song.coverImage,
      });
    }
  };

  // Parse out the actual genre from the description (usually in format "Genre: X")
  const genre = artist.description.includes("Genre:")
    ? artist.description.split("Genre:")[1].trim()
    : artist.description;

  return (
    <div className="artist-modal-backdrop" onClick={handleBackdropClick}>
      <div className="artist-modal-content">
        <button className="artist-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="artist-modal-grid">
          <div className="artist-modal-image-container">
            <img
              src={artist.imageUrl}
              alt={artist.title}
              className="artist-modal-image"
            />
          </div>

          <div className="artist-modal-details">
            <h2 className="artist-modal-title">{artist.title}</h2>
            <p className="artist-modal-genre">{genre}</p>

            <div className="artist-stats">
              <div className="stat-item">
                <div className="stat-number">
                  {artist.monthlyListeners || "2.4M"}
                </div>
                <div className="stat-label">Monthly Listeners</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{artist.followers || "1.8M"}</div>
                <div className="stat-label">Followers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{artist.albumsCount || 5}</div>
                <div className="stat-label">Albums</div>
              </div>
            </div>

            <p className="artist-modal-description">
              {artist.bio ||
                `${artist.title} is a ${genre} artist known for their unique sound and captivating performances. 
              With a growing fanbase worldwide, they continue to push boundaries and redefine the genre.`}
            </p>
          </div>
        </div>

        <div className="popular-songs-section">
          <h3 className="popular-songs-title">Popular Songs</h3>
          <ul className="popular-songs-list">
            {(artist.popularSongs || defaultSongs(artist.title, genre)).map(
              (song, index) => (
                <li className="song-item" key={song.id}>
                  <div className="song-number">{index + 1}</div>
                  <img
                    src={song.coverImage}
                    alt={song.title}
                    className="song-cover"
                  />
                  <div className="song-info">
                    <div className="song-title">{song.title}</div>
                    <div className="song-meta">
                      <span className="song-album">{song.album}</span>
                      <span className="song-streams">
                        {song.streams} streams
                      </span>
                    </div>
                  </div>
                  <button
                    className="play-button"
                    onClick={() => handlePreviewSong(song)}
                    aria-label={`Play ${song.title}`}
                  >
                    <Play size={20} />
                  </button>
                </li>
              )
            )}
          </ul>
        </div>

        {(artist.relatedArtists || defaultRelatedArtists(genre)).length > 0 && (
          <div className="related-artists-section">
            <h3 className="related-artists-title">Related Artists</h3>
            <div className="related-artists-list">
              {(artist.relatedArtists || defaultRelatedArtists(genre)).map(
                (relatedArtist) => (
                  <div className="related-artist" key={relatedArtist.id}>
                    <img
                      src={relatedArtist.imageUrl}
                      alt={relatedArtist.name}
                      className="related-artist-img"
                    />
                    <div className="related-artist-name">
                      {relatedArtist.name}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Default songs if none provided
const defaultSongs = (artistName: string, genre: string) => {
  const defaultCovers = [
    "https://i.scdn.co/image/ab67616d0000b273af52c228c9619ff6298b08cd",
    "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a",
    "https://i.scdn.co/image/ab67616d0000b273ba718c57dd246f7c3d3e103f",
    "https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b",
  ];

  return [
    {
      id: `${artistName.toLowerCase().replace(/\s/g, "-")}-song-1`,
      title: `${genre} Anthem`,
      album: "Greatest Hits",
      duration: "3:42",
      streams: "12.5M",
      coverImage: defaultCovers[0],
      songUrl: "https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3",
    },
    {
      id: `${artistName.toLowerCase().replace(/\s/g, "-")}-song-2`,
      title: "New Horizons",
      album: "Breakthrough",
      duration: "4:15",
      streams: "8.7M",
      coverImage: defaultCovers[1],
    },
    {
      id: `${artistName.toLowerCase().replace(/\s/g, "-")}-song-3`,
      title: "Midnight Dreams",
      album: "Evolution",
      duration: "3:38",
      streams: "6.9M",
      coverImage: defaultCovers[2],
    },
    {
      id: `${artistName.toLowerCase().replace(/\s/g, "-")}-song-4`,
      title: "Forever Young",
      album: "Memories",
      duration: "4:05",
      streams: "5.3M",
      coverImage: defaultCovers[3],
    },
  ];
};

// Default related artists based on genre
const defaultRelatedArtists = (genre: string) => {
  // Different defaults based on genre
  if (genre.toLowerCase().includes("trap")) {
    return [
      {
        id: "ra-1",
        name: "Drake",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
      },
      {
        id: "ra-2",
        name: "Bvcovia",
        imageUrl:
          "https://i.scdn.co/image/ab67616d00001e02fc8ff4b9493ee2e7430399a0",
      },
      {
        id: "ra-3",
        name: "Future",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyzs8B4NPBiFEv-Py4QSKv6AdXBRCr8pTNgw&s",
      },
    ];
  } else if (genre.toLowerCase().includes("k-pop")) {
    return [
      {
        id: "ra-4",
        name: "Blackpink",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Blackpink_Coachella_2023_02_%28cropped%29.jpg/1200px-Blackpink_Coachella_2023_02_%28cropped%29.jpg",
      },
      {
        id: "ra-5",
        name: "Twice",
        imageUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Twice_-_Dickies_Arena%2C_2022_%28cropped%29.jpg/1200px-Twice_-_Dickies_Arena%2C_2022_%28cropped%29.jpg",
      },
      {
        id: "ra-6",
        name: "ENHYPEN",
        imageUrl:
          "https://wwd.com/wp-content/uploads/2023/10/Enhypen_0108.jpg",
      },
    ];
  } else if (genre.toLowerCase().includes("rock")) {
    return [
      {
        id: "ra-7",
        name: "Metallica",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eb69ca98dd3083f1082d740e44",
      },
      {
        id: "ra-8",
        name: "System of a Down",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eb60063d3451ade8f9fab397c2",
      },
      {
        id: "ra-9",
        name: "Linkin Park",
        imageUrl:
          "hhttps://townsquare.media/site/366/files/2014/12/Linkin-Park.jpg?w=780&q=75https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1ta6fvFCVRq-iXNNgHvL2rHTfySg_CexmQw&s",
      },
    ];
  } else {
    return [
      {
        id: "ra-10",
        name: "Taylor Swift",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eb6a224073987b930f99adc8bc",
      },
      {
        id: "ra-11",
        name: "Ed Sheeran",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba",
      },
      {
        id: "ra-12",
        name: "Adele",
        imageUrl:
          "https://i.scdn.co/image/ab6761610000e5eb68f6e5892008c03f95bea6cd",
      },
    ];
  }
};

export default ArtistModal;