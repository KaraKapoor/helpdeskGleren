import React, { Component } from "react";
import { css } from "@emotion/core";
import FadeLoader from "react-spinners/FadeLoader";
class showLoader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayCountResponse: null
        }
    }
    render() {
        return (
            <div style={{width:"100px",height:"100px",position:"absolute",top:0,bottom:0,left:0,right:0,margin:"auto"}}>
                <FadeLoader loading={true} size={150} />
            </div>
        )
    }
}
export default showLoader;