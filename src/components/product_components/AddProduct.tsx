import { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { apiCall } from "../../utils/apiCall";
import { Product } from "../../models/models";
import ViewProduct from "./ViewProduct";

function AddProduct() {
  const [productData, setProductData] = useState<Product>({
    name: "",
    type: "",
    subtype: "",
    description: "",
    metaData: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [showProduct, setShowProduct] = useState(false);
  const [addedProduct, setAddedProduct] = useState(productData);

  const handleChange = (key: string, value: string) => {
    setProductData({
      ...productData,
      [key]: value,
    });
  };

  const validate_form = () => {
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
        setAddedProduct(response.data);
        setShowProduct(true);
      } else if (
        typeof response.data === "object" &&
        "detail" in response.data
      ) {
        setAlertMessage(response.data["detail"]);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setAlertMessage("Check console for errors");
    }
  };

  const form = (
    <>
      <Container className="mt-3">
        <Row>
          <Col></Col>
          <Col sm={8}>
            <div>
              <h2>Add New Product</h2>

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

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary"
                >
                  Add Product
                </button>
              </form>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );

  const addedProductView = (
    <ViewProduct
      product={addedProduct}
      backSign={false}
      updatable={true}
      updateFunction={(product: Product) => {
        setAddedProduct(product);
      }}
    ></ViewProduct>
  );

  return (
    <>
      {showProduct && addedProductView}
      {!showProduct && form}
    </>
  );
}

export default AddProduct;
