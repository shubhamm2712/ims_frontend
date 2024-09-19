import { Product } from "../../models/models";
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { useState } from "react";
import UpdateProduct from "./UpdateProduct";

interface Props {
  product: Product;
  backSign?: boolean;
  handleCloseProduct?: () => void;
  updatable?: boolean;
  updateFunction?: (product: Product) => void;
}

function ViewProduct({
  product,
  handleCloseProduct = () => {},
  backSign = true,
  updatable = false,
  updateFunction = () => {},
}: Props) {
  const [useProduct, setUseProduct] = useState(product);
  const [showUpdate, setShowUpdate] = useState(false);

  const updateForm = (
    <UpdateProduct
      product={useProduct}
      onCancel={() => {
        setShowUpdate(false);
      }}
      onUpdated={(product: Product) => {
        updateFunction(product);
        setUseProduct(product);
      }}
    ></UpdateProduct>
  );
  const viewProduct = (
    <>
      {backSign && (
        <>
          <p className="mt-2">
            <a
              onClick={handleCloseProduct}
              style={{ color: "black", cursor: "pointer" }}
            >
              {"< "}Back
            </a>
          </p>
        </>
      )}
      <Card className="mt-2">
        <Card.Header>
          <h4 className="d-flex">
            Product Details{" "}
            {updatable && (
              <FontAwesomeIcon
                className="ms-auto"
                icon={faPenToSquare}
                onClick={() => {
                  setShowUpdate(true);
                }}
              />
            )}
          </h4>
        </Card.Header>
        <Card.Body>
          <Card.Title className="mb-3">
            <strong>{useProduct.name}</strong>
          </Card.Title>
          <Row className="ms-5">
            <Col md={6} className="mt-2">
              {useProduct.type && (
                <Card.Text>
                  <strong>Type:</strong> {useProduct.type}
                </Card.Text>
              )}
              {useProduct.quantity !== undefined && (
                <Card.Text>
                  <strong>Quantity:</strong> {useProduct.quantity}
                </Card.Text>
              )}
              {useProduct.avgBuyRate !== undefined && (
                <Card.Text>
                  <strong>Avg Buy Rate:</strong> $
                  {useProduct.avgBuyRate !== undefined &&
                    useProduct.avgBuyRate.toFixed(2)}
                </Card.Text>
              )}
              {useProduct.usedInTransaction !== undefined && (
                <Card.Text>
                  <strong>Used In Transaction:</strong>{" "}
                  {useProduct.usedInTransaction ? "Yes" : "No"}
                </Card.Text>
              )}
            </Col>
            <Col md={6} className="mt-2">
              {useProduct.description && (
                <Card.Text>
                  <strong>Description:</strong> {useProduct.description}
                </Card.Text>
              )}
              {useProduct.metaData && (
                <Card.Text>
                  <strong>Meta Data:</strong> {useProduct.metaData}
                </Card.Text>
              )}
              {useProduct.subtype && (
                <Card.Text>
                  <strong>Subtype:</strong> {useProduct.subtype}
                </Card.Text>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );

  return (
    <>
      {!showUpdate && viewProduct}
      {showUpdate && updateForm}
    </>
  );
}

export default ViewProduct;
