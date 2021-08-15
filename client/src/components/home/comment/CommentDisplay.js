import React, {useState, useEffect} from 'react'
import CommentCard from "./CommentCard";

const CommentDisplay = ({comment, post, replyCm}) => {
    const [showRep, setShowRep] = useState([])
    const [next, setNext] = useState(1)

    useEffect(() => {
        setShowRep(replyCm.slice(replyCm.length - next))
    }, [replyCm, next])

    return (
        <CommentCard comment={comment} post={post} commentId={comment._id}>
            <div style={{paddingLeft: "16px"}}>
                {showRep.map(
                    (item, index) =>
                        item.reply && (
                            <CommentCard
                                key={index}
                                comment={item}
                                post={post}
                                commentId={comment._id}
                            />
                        )
                )}

                {replyCm.length - next > 0 ? (
                    <div
                        className="more-comment"
                        onClick={() => setNext(next + 10)}
                    >
                        Xem thêm
                    </div>
                ) : (
                    replyCm.length > 1 && (
                        <div className="more-comment" onClick={() => setNext(1)}>
                            Ẩn bớt
                        </div>
                    )
                )}
            </div>
        </CommentCard>
    );
}

export default CommentDisplay