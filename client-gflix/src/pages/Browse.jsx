import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Info, Play, LogOut, Plus, Check } from 'lucide-react';

const Browse = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [myList, setMyList] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMyList = (id) => {
        if (myList.includes(id)) {
            setMyList(myList.filter(item => item !== id));
        } else {
            setMyList([...myList, id]);
        }
    };

    const isInList = (id) => myList.includes(id);

    return (
        <div className="bg-[#141414] min-h-screen text-white">
            <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-8 md:px-12 py-4 flex items-center justify-between transition-colors duration-300">
                <div className="flex items-center gap-8 md:gap-12">
                    <h1 className="text-red-600 text-2xl font-bold uppercase tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0, 0)}>Gflix</h1>
                    <ul className="hidden md:flex gap-6 text-sm text-gray-300">
                        <li className="text-white font-bold cursor-pointer">Home</li>
                        <li className="hover:text-gray-400 cursor-pointer transition">Series</li>
                        <li className="hover:text-gray-400 cursor-pointer transition">Films</li>
                        <li className="hover:text-gray-400 cursor-pointer transition">New & Popular</li>
                        <li className="hover:text-gray-400 cursor-pointer transition">My List ({myList.length})</li>
                    </ul>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2 top-1.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Titles, people, genres"
                            className="bg-black/50 border border-gray-500 text-white text-sm pl-9 pr-4 py-1.5 rounded focus:outline-none focus:border-white transition-all w-32 focus:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Bell className="w-6 h-6 cursor-pointer" />
                    <div className="flex items-center gap-2 cursor-pointer group relative">
                        <img src="https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-qo9h82134t9nv0j0.jpg" alt="Profile" className="w-8 h-8 rounded" />
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded font-bold ml-2">
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            
            {!searchTerm && (
                <div className="relative h-[70vh] md:h-[80vh] w-full">
                    <img
                        src="https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABSpjhXw2b4wbdk3w8_q5K0b_-21y7-0741d4c7-10e1-40af-bcae-07a3f8dc141a.jpg?r=298"
                        className="w-full h-full object-cover brightness-[0.6]"
                        alt="Hero"
                    />
                    <div className="absolute top-[30%] left-8 md:left-12 max-w-xl">
                        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">Stranger Things</h1>
                        <p className="text-base md:text-lg drop-shadow-md mb-6 line-clamp-3">
                            When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black px-6 md:px-8 py-2 rounded flex items-center gap-2 font-bold hover:bg-opacity-80 transition">
                                <Play fill="black" size={24} /> Play
                            </button>
                            <button className="bg-gray-500/70 text-white px-6 md:px-8 py-2 rounded flex items-center gap-2 font-bold hover:bg-opacity-50 transition">
                                <Info size={24} /> More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`px-8 md:px-12 py-8 ${!searchTerm ? '-mt-24' : 'mt-20'} relative z-10`}>

                {searchTerm ? (
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-white">Results for "{searchTerm}"</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {[1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15].map((i) => (
                                <div key={i} className="aspect-video bg-gray-800 rounded hover:scale-105 transition-transform duration-300 cursor-pointer relative group">
                                    <img src={`https://picsum.photos/400/225?random=${i}`} className="w-full h-full object-cover rounded" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                                        <p className="font-bold">Title {i}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-xl font-bold mb-4 text-white">Trending Now</h3>
                        <div className="flex gap-2 overflow-x-auto pb-8 scrollbar-hide">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="min-w-[200px] h-[120px] bg-gray-800 rounded hover:scale-110 transition-transform duration-300 cursor-pointer relative group">
                                    <img src={`https://picsum.photos/400/225?random=${i}`} className="w-full h-full object-cover rounded" />
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleMyList(i); }}
                                            className="bg-black/60 p-1.5 rounded-full border border-gray-400 hover:bg-white hover:text-black transition"
                                        >
                                            {isInList(i) ? <Check size={16} /> : <Plus size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-xl font-bold mb-4 text-white">Top Picks for {user?.name || 'You'}</h3>
                        <div className="flex gap-2 overflow-x-auto pb-8 scrollbar-hide">
                            {[10, 11, 12, 13, 14, 15].map((i) => (
                                <div key={i} className="min-w-[200px] h-[120px] bg-gray-800 rounded hover:scale-110 transition-transform duration-300 cursor-pointer relative group">
                                    <img src={`https://picsum.photos/400/225?random=${i}`} className="w-full h-full object-cover rounded" />
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleMyList(i); }}
                                            className="bg-black/60 p-1.5 rounded-full border border-gray-400 hover:bg-white hover:text-black transition"
                                        >
                                            {isInList(i) ? <Check size={16} /> : <Plus size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {myList.length > 0 && (
                            <>
                                <h3 className="text-xl font-bold mb-4 text-white">My List</h3>
                                <div className="flex gap-2 overflow-x-auto pb-8 scrollbar-hide">
                                    {myList.map((i) => (
                                        <div key={i} className="min-w-[200px] h-[120px] bg-gray-800 rounded hover:scale-110 transition-transform duration-300 cursor-pointer relative group">
                                            <img src={`https://picsum.photos/400/225?random=${i}`} className="w-full h-full object-cover rounded" />
                                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleMyList(i); }}
                                                    className="bg-black/60 p-1.5 rounded-full border border-gray-400 hover:bg-white hover:text-black transition"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Browse;
