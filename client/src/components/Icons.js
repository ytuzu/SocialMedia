import React from "react";

const Icon = ({type, notify}) => {
    const icons = {
        message: "fas fa-comment",
        sortDown: "fas fa-sort-down",
        notification: "fas fa-bell",
    };

    return (
        <div className="header__icon">
            <i className={icons[type]}/>
            {notify && (
                <div className="header__icon-notify">
                    <span>{notify.data.length}</span>
                </div>
            )}
        </div>
    );
}

export default Icon;