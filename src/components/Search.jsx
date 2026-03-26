import { useState } from "react";
import { searchMulti } from "../utils/tmdb";
import MovieCard from "./MovieCard";

export default function Search() {
  const [results, setResults] = useState([]);

  const handle = async (e) => {
    const q = e.target.value;

    if (q.length > 2) {
      const data = await searchMulti(q);

      const filtered = data
        .filter((x) => x.poster_path)
        .map((x) => ({
          id: x.id,
          poster: x.poster_path,
          type: x.media_type,
        }));

      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="mb-10">
      <input
        placeholder="Search movies or TV..."
        onChange={handle}
        className="w-full max-w-md p-2 bg-gray-900 border border-gray-700 rounded text-white"
      />

      {results.length > 0 && (
        <div className="flex gap-3 mt-4 overflow-x-auto">
          {results.map((r) => (
            <MovieCard key={r.id} movie={r} />
          ))}
        </div>
      )}
    </div>
  );
}