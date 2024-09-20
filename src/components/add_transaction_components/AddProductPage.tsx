import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Stack,
} from "react-bootstrap";
import { Product, TransactionItem } from "../../models/models";
import { useState } from "react";

interface Props {
  products: Product[];
  selectedProductIds: number[];
  onCancel: () => void;
  addToSelected: (transactionItem: TransactionItem) => void;
}

function AddProductPage({
  products,
  selectedProductIds,
  onCancel,
  addToSelected,
}: Props) {
  const [currentAlert, setCurrentAlert] = useState("");

  const emptyTransactionItem: TransactionItem = {
    productId: 0,
    name: "",
    productType: "",
    productDescription: "",
    productMetaData: "",
    productSubtype: "",
    quantity: 0,
    rate: 0,
  };

  const [selectProduct, setSelectProduct] =
    useState<TransactionItem>(emptyTransactionItem);

  const validate_add_product = () => {
    if (
      selectProduct.productId === undefined ||
      selectProduct.productId === 0
    ) {
      setCurrentAlert("No product selected");
      return false;
    }
    if (selectProduct.name === undefined || selectProduct.name.trim() === "") {
      setCurrentAlert("Invalid product name");
      return false;
    }
    if (selectProduct.quantity === undefined || selectProduct.quantity <= 0) {
      setCurrentAlert("Invalid product quantity");
      return false;
    }
    if (selectProduct.rate === undefined || selectProduct.rate <= 0) {
      setCurrentAlert("Invalid product rate");
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (validate_add_product()) {
      addToSelected(selectProduct);
      onCancel();
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectProduct({
      productId: product.id,
      name: product.name,
      productType: product.type,
      productSubtype: product.subtype,
      productDescription: product.description,
      productMetaData: product.metaData,
      quantity: 0,
      rate: 0,
    });
  };

  return (
    <>
      <Container className="mt-2 mb-4">
        {currentAlert && (
          <Alert
            className="alert alert-danger"
            onClose={() => {
              setCurrentAlert("");
            }}
            dismissible
          >
            {currentAlert}
          </Alert>
        )}
        <h2 className="mb-2">Select Product</h2>

        <ListGroup>
          {products.map((product) => {
            if (
              selectedProductIds.includes(
                product.id !== undefined ? product.id : -1
              )
            ) {
              return <div key={product.id}></div>;
            }
            return (
              <div key={product.id}>
                <ListGroup.Item
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <Row>
                    <Col
                      xs={1}
                      className="d-flex justify-content-center align-items-center"
                    >
                      <Form.Check
                        type="radio"
                        checked={selectProduct.productId === product.id}
                        onChange={() => {}}
                      ></Form.Check>
                    </Col>
                    <Col>
                      <Row>
                        {/* Product Name */}
                        <Col md={3}>
                          <strong>Name:</strong> {product.name}
                        </Col>

                        {/* Product Type */}
                        <Col md={3}>
                          <strong>Type:</strong> {product.type}
                        </Col>

                        {/* Product Quantity */}
                        <Col md={2}>
                          <strong>Quantity:</strong> {product.quantity}
                        </Col>

                        {/* Avg Buy Rate */}
                        <Col md={4}>
                          <strong>Avg Buy Rate: $</strong>{" "}
                          {product.avgBuyRate?.toFixed(2)}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {selectProduct.productId === product.id && (
                  <div key={product.id + "div"}>
                    <ListGroup.Item key={product.id + "q"}>
                      <Row>
                        <Col xs={1}></Col>
                        <Col>
                          <Row>
                            <Col sm={6}>
                              <Form.Group>
                                <Stack direction="horizontal" gap={2}>
                                  <Form.Label className="me-0" column>
                                    <strong>Quantity: </strong>
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={
                                      selectProduct.quantity === 0
                                        ? ""
                                        : selectProduct.quantity
                                    }
                                    placeholder="0"
                                    onChange={(event) => {
                                      setSelectProduct({
                                        ...selectProduct,
                                        quantity: Number(
                                          Number(event.target.value).toFixed(4)
                                        ),
                                      });
                                    }}
                                  ></Form.Control>
                                </Stack>
                              </Form.Group>
                            </Col>
                            <Col sm={6}>
                              <Form.Group>
                                <Stack direction="horizontal" gap={2}>
                                  <Form.Label>
                                    <strong>Rate:</strong>$
                                  </Form.Label>
                                  <Form.Control
                                    type="number"
                                    value={
                                      selectProduct.rate === 0
                                        ? ""
                                        : selectProduct.rate
                                    }
                                    placeholder="0"
                                    onChange={(event) => {
                                      setSelectProduct({
                                        ...selectProduct,
                                        rate: Number(
                                          Number(event.target.value).toFixed(2)
                                        ),
                                      });
                                    }}
                                  ></Form.Control>
                                </Stack>
                              </Form.Group>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item key={product.id + "s"}>
                      <Form.Group className="">
                        <Row>
                          <Col xs={1}></Col>
                          <Col>
                            <Row>
                              <Col sm={6} className="mt-2">
                                <Button
                                  variant="secondary"
                                  type="button"
                                  onClick={onCancel}
                                  style={{ width: "100%" }}
                                >
                                  Cancel
                                </Button>
                              </Col>
                              <Col sm={6} className="mt-2">
                                <Button
                                  variant="primary"
                                  type="button"
                                  onClick={handleAdd}
                                  style={{ width: "100%" }}
                                >
                                  Add
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form.Group>
                    </ListGroup.Item>
                  </div>
                )}
              </div>
            );
          })}
          <ListGroup.Item
            key="-1"
            onClick={() =>
              setSelectProduct({ ...emptyTransactionItem, productId: -1 })
            }
            style={{ cursor: "pointer" }}
          >
            <Row>
              <Col
                xs={1}
                className="d-flex justify-content-center align-items-center"
              >
                <Form.Check
                  type="radio"
                  checked={selectProduct.productId === -1}
                  onChange={() => {}}
                ></Form.Check>
              </Col>
              <Col className="d-flex justify-content-center">
                <strong>Add new product</strong>
              </Col>
            </Row>
          </ListGroup.Item>
          {selectProduct.productId === -1 && (
            <div key={"-1others"}>
              <ListGroup.Item key={"-1n"}>
                <Row>
                  <Col xs={1}></Col>
                  <Col>
                    <Form.Group>
                      <Stack direction="horizontal" gap={2}>
                        <Form.Label>
                          <strong>Name: </strong>
                        </Form.Label>
                        <Form.Control
                          type="input"
                          value={
                            selectProduct.name === undefined
                              ? ""
                              : selectProduct.name
                          }
                          placeholder="Name"
                          onChange={(event) => {
                            setSelectProduct({
                              ...selectProduct,
                              name: event.target.value,
                            });
                          }}
                        ></Form.Control>
                      </Stack>
                    </Form.Group>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item key={"-1t"}>
                <Row>
                  <Col xs={1}></Col>
                  <Col>
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Stack direction="horizontal" gap={2}>
                            <Form.Label className="me-0" column>
                              <strong>Type: </strong>
                            </Form.Label>
                            <Form.Control
                              type="input"
                              value={
                                selectProduct.productType === undefined
                                  ? ""
                                  : selectProduct.productType
                              }
                              placeholder="Type"
                              onChange={(event) => {
                                setSelectProduct({
                                  ...selectProduct,
                                  productType: event.target.value,
                                });
                              }}
                            ></Form.Control>
                          </Stack>
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Stack direction="horizontal" gap={2}>
                            <Form.Label className="me-0" column>
                              <strong>Subtype: </strong>
                            </Form.Label>
                            <Form.Control
                              type="input"
                              value={
                                selectProduct.productSubtype === undefined
                                  ? ""
                                  : selectProduct.productSubtype
                              }
                              placeholder="Subtype"
                              onChange={(event) => {
                                setSelectProduct({
                                  ...selectProduct,
                                  productSubtype: event.target.value,
                                });
                              }}
                            ></Form.Control>
                          </Stack>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item key={"-1d"}>
                <Row>
                  <Col xs={1}></Col>
                  <Col>
                    <Form.Group>
                      <Stack direction="horizontal" gap={2}>
                        <Form.Label>
                          <strong>Description: </strong>
                        </Form.Label>
                        <Form.Control
                          type="textarea"
                          value={
                            selectProduct.productDescription === undefined
                              ? ""
                              : selectProduct.productDescription
                          }
                          placeholder="Description"
                          onChange={(event) => {
                            setSelectProduct({
                              ...selectProduct,
                              productDescription: event.target.value,
                            });
                          }}
                        ></Form.Control>
                      </Stack>
                    </Form.Group>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item key={"-1m"}>
                <Row>
                  <Col xs={1}></Col>
                  <Col>
                    <Form.Group>
                      <Stack direction="horizontal" gap={2}>
                        <Form.Label>
                          <strong>MetaData: </strong>
                        </Form.Label>
                        <Form.Control
                          type="input"
                          value={
                            selectProduct.productMetaData === undefined
                              ? ""
                              : selectProduct.productMetaData
                          }
                          placeholder="MetaData"
                          onChange={(event) => {
                            setSelectProduct({
                              ...selectProduct,
                              productMetaData: event.target.value,
                            });
                          }}
                        ></Form.Control>
                      </Stack>
                    </Form.Group>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item key={"-1q"}>
                <Row>
                  <Col xs={1}></Col>
                  <Col>
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Stack direction="horizontal" gap={2}>
                            <Form.Label className="me-0" column>
                              <strong>Quantity: </strong>
                            </Form.Label>
                            <Form.Control
                              type="number"
                              value={
                                selectProduct.quantity === 0
                                  ? ""
                                  : selectProduct.quantity
                              }
                              placeholder="0"
                              onChange={(event) => {
                                setSelectProduct({
                                  ...selectProduct,
                                  quantity: Number(
                                    Number(event.target.value).toFixed(4)
                                  ),
                                });
                              }}
                            ></Form.Control>
                          </Stack>
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Stack direction="horizontal" gap={2}>
                            <Form.Label>
                              <strong>Rate:</strong>$
                            </Form.Label>
                            <Form.Control
                              type="number"
                              value={
                                selectProduct.rate === 0
                                  ? ""
                                  : selectProduct.rate
                              }
                              placeholder="0"
                              onChange={(event) => {
                                setSelectProduct({
                                  ...selectProduct,
                                  rate: Number(
                                    Number(event.target.value).toFixed(2)
                                  ),
                                });
                              }}
                            ></Form.Control>
                          </Stack>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item key={"-1s"}>
                <Form.Group className="">
                  <Row>
                    <Col xs={1}></Col>
                    <Col>
                      <Row>
                        <Col sm={6} className="mt-2">
                          <Button
                            variant="secondary"
                            type="button"
                            onClick={onCancel}
                            style={{ width: "100%" }}
                          >
                            Cancel
                          </Button>
                        </Col>
                        <Col sm={6} className="mt-2">
                          <Button
                            variant="primary"
                            type="button"
                            onClick={handleAdd}
                            style={{ width: "100%" }}
                          >
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form.Group>
              </ListGroup.Item>
            </div>
          )}
        </ListGroup>
      </Container>
    </>
  );
}

export default AddProductPage;
