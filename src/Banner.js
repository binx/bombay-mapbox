import styled from "styled-components";

import fishImg from "./fish.png";

const BannerWrapper = styled.div`
  padding: 16px 0 36px;
  letter-spacing: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 30px;
  }
`;

function Banner() {
  return (
    <BannerWrapper>
      <img
        src={fishImg}
        alt="fish skeleton"
        style={{ transform: "scaleX(-1)", marginRight: "18px" }}
      />
      bombay beach
      <img src={fishImg} alt="fish skeleton" style={{  marginLeft: "14px" }} />
    </BannerWrapper>
  );
}

export default Banner;
