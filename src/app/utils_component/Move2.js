import React from "react";
import { MoreVertical } from "react-feather";

function Move2 ({className}){

    return(
        <div
        className={className? className : ''}
        style={{
            position: "relative",
            width: "24px",
            height: "24px",
        }}
        >
            <MoreVertical
            style={{
                position: "absolute",
                left: "4px"
            }}
            />
            <MoreVertical
            style={{
                position: "absolute",
                right: "4px"
            }}
            />
        </div>
    )
}

export {Move2}
