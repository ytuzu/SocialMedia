import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getDiscoverPosts, DISCOVER_TYPES} from "../redux/actions/discoverAction";
import PostThumb from "../components/PostThumb";
import {getDataAPI} from '../utils/fetchData';
import LoadMoreButton from "../components/LoadMoreButton";

const LoadIcon = 'https://res.cloudinary.com/nguyenhnhatquang/image/upload/v1628335180/Spinner-0.5s-200px_s19crb.gif'

const Discover = () => {
    const {auth, discover} = useSelector(state => state);
    const dispatch = useDispatch();

    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (!discover.firstLoad) {
            dispatch(getDiscoverPosts(auth.token));
        }
    }, [dispatch, auth.token, discover.firstLoad]);

    const handleLoadMore = async () => {
        setLoad(true);
        const res = await getDataAPI(`post_discover?num=${discover.page * 8}`, auth.token);
        dispatch({type: DISCOVER_TYPES.UPDATE_POSTS, payload: res.data});
        setLoad(false);
    };

    return (
        <div className="discover">
            {discover.loading ? (
                <img
                    src={LoadIcon}
                    alt="Loading..."
                    className="loading__profile"
                />
            ) : (
                <PostThumb posts={discover.posts} result={discover.result}/>
            )}

            {load && (
                <img src={LoadIcon} alt="Loading..."/>
            )}

            <button
                className="btn loadMoreButton"
                onClick={handleLoadMore}
            >
                Xem thêm
            </button>
        </div>
    );
}

export default Discover;