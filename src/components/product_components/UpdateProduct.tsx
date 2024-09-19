import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Product } from "../../models/models";

interface Props {
  product: Product;
  onCancel: () => void;
  onUpdated: (product: Product) => void;
}

function UpdateProduct({ product, onCancel, onUpdated }: Props) {
  const [productData, setProductData] = useState<Product>(product);

  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (key: string, value: string) => {
    setProductData({
      ...productData,
      [key]: value,
    });
  };

  const validate_form = () => {
    if (!productData.id) {
      setAlertMessage("Id missing or 0");
      return false;
    }
    if (productData.name) {
      productData.name = productData.name.trim();
      if (productData.name === "") {
        setAlertMessage("Name cannot be empty");
        return false;
      }
    } else {
      setAlertMessage("Name cannot be empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate_form()) {
      return;
    }
    try {
      const response = await apiCall<Product>(
        "POST",
        "/products/add_product",
        productData
      );
      if (
        response.success &&
        typeof response.data === "object" &&
        "id" in response.data
      ) {
        onCancel();
        onUpdated(response.data);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setAlertMessage("Check console for errors");
    }
  };

  return (
    <>
      <div>
        <h2 className="mt-2">Update Product</h2>

        {alertMessage && (
          <Alert
            className="alert alert-danger"
            onClose={() => {
              setAlertMessage("");
            }}
            dismissible
          >
            {alertMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Product Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={productData.name || ""}
              onChange={(event) => {
                handleChange(event.target.name, event.target.value);
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Product Type
            </label>
            <input
              type="text"
              className="form-control"
              id="type"
              name="type"
              value={productData.type || ""}
              onChange={(event) => {
                handleChange(event.target.name, event.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="subtype" className="form-label">
              Product Subtype
            </label>
            <input
              type="text"
              className="form-control"
              id="subtype"
              name="subtype"
              value={productData.subtype || ""}
              onChange={(event) => {
                handleChange(event.target.name, event.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={productData.description || ""}
              onChange={(event) => {
                handleChange(event.target.name, event.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="metaData" className="form-label">
              Metadata
            </label>
            <input
              type="text"
              className="form-control"
              id="metaData"
              name="metaData"
              value={productData.metaData || ""}
              onChange={(event) => {
                handleChange(event.target.name, event.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <Container>
              <Row>
                <Col>
                  <label className="form-label">Quantity</label>
                  {": "}
                  <strong>{product.quantity}</strong>
                </Col>
                <Col>
                  <label className="form-label">Avg Buy Rate</label>
                  {": $"}
                  <strong>{product.avgBuyRate}</strong>
                </Col>
                <Col>
                  <label className="form-label">Used in Transactions</label>
                  {": "}
                  <strong>
                    {product.usedInTransaction == 1 ? "Yes" : "No"}
                  </strong>
                </Col>
              </Row>
            </Container>
          </div>

          <div className="mb-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Update Product
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary ms-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateProduct;
