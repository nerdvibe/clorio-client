// File unused

// import { useState } from "react";
// import Hoc from "../components/UI/Hoc";
// import Logo from "../components/UI/Logo";
// import { Row, Col } from "react-bootstrap";
// import Button from "../components/UI/Button";
// import Footer from "../components/UI/Footer";
// import ProgressBar from "../components/UI/ProgressBar";

// const Entropy = () => {
//   const [progress] = useState<number>(20);

//   /**
//    * Generate a random hexadecimal string
//    * @param size number
//    * @returns string
//    */
//   const generateRandomHex = (size: number) =>
//     [...Array(size)]
//       .map(() => Math.floor(Math.random() * 16).toString(16))
//       .join("");

//   return (
//     <Hoc className="main-container center no-scroll">
//       <div className="block-container no-bg real-full-page-container no-margin">
//         <div className="vertical-center no-scroll" style={{ height: "50vh" }}>
//           <Row className="vertical-center">
//             <Col xs={6} className="offset-md-3 full-width-align-center">
//               <Logo big={true} />
//               <div className="v-spacer" />
//               <h4 className="full-width-align-center strong">
//                 Here we go! <br />
//                 Move your mouse around to create random Bytes.
//               </h4>
//               <ProgressBar
//                 progress={progress}
//                 text={generateRandomHex(progress)}
//               />
//               <div className="v-spacer" />
//               <Row>
//                 <Col>
//                   <Button className="link-button" text="Go back" link={"/"} />
//                 </Col>
//                 <Col>
//                   <Button
//                     className="lightGreenButton__fullMono margin-auto"
//                     text="Next step"
//                     link={"/register-2"}
//                   />
//                 </Col>
//               </Row>
//             </Col>
//           </Row>
//         </div>
//       </div>
//       <Footer />
//     </Hoc>
//   );
// };

// export default Entropy;

export default {}
