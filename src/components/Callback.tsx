import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Callback() {
  const [message, setMessage] = useState("Authorizing...");
  const navigate = useNavigate();

  const url = window.location.origin;

  const queryParams = new URLSearchParams(window.location.search);
  const authorizationCode = queryParams.get("code");

  const verifier = localStorage.getItem("verifier");

  useEffect(() => {
    const handleCallback = async () => {
      const response = await fetch(
        "https://dev-kz2fpaq4oiht7zgs.us.auth0.com/oauth/token",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: "yUnBLFVRvSWGNFe8Kt1BxlRBBKf6GFNB",
            code_verifier: verifier,
            code: authorizationCode,
            redirect_uri: url,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data["access_token"]);
        if (data.id_token) {
          localStorage.setItem("idToken", data["id_token"]);
        }
        navigate("/dashboard");
      } else {
        setMessage("Inform the developer about this error");
        console.log(response);
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    };
    if (
      authorizationCode === undefined ||
      authorizationCode == null ||
      authorizationCode == ""
    ) {
      navigate("/");
    } else {
      handleCallback();
    }
  }, []);
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "calc(100vh)" }}
    >
      <Row>
        <Col></Col>
        <Col className="text-center">
          <h2>{message}</h2>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Callback;
