import React, { useRef, useState } from "react";
import {
  Dropdown,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
} from "react-bootstrap";
import Flex from "../common/Flex";
import IconButton from "../common/IconButton";
import { copyToClipBoard } from "../../helpers/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import taskService from "../../services/taskService";
import toastr from "toastr";

const CreateNewBoard = () => {
  const boardNameRef = useRef(null);

  const handleCreate = (e) => {
    e.preventDefault();
    const payload = {};
    payload.name = boardNameRef.current.value;
    taskService
      .createBoard(payload)
      .then(onCreateBoardSuccess)
      .catch(onCreateBoardError);
  };

  const onCreateBoardSuccess = () => {
    toastr.success("You created a new board!");
    boardNameRef.current.value = "";
  };
  const onCreateBoardError = (err) => {
    console.log(err);
  };
  return (
    <Dropdown>
      <Dropdown.Toggle variant="falcon-default" size="sm" className="mx-2">
        <FontAwesomeIcon icon="plus" className="me-2" />
        Create a New Task Board
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="pt-2 pb-0 text-nowrap end-0"
        style={{ minWidth: "300px" }}
      >
        <h6 className="dropdown-header text-center ls">
          Create a New Task Board
        </h6>
        <Dropdown.Divider className="mb-0" />
        <div className="p-3">
          <Form>
            <div className="border rounded-1 fs--2 mb-3">
              <Flex
                alignItems="center"
                justifyContent="between"
                className="border-bottom bg-200"
              >
                <div className="px-2 text-700">Name your new Board</div>
                <div className="border-start"></div>
              </Flex>
            </div>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter name of new task board"
              ref={boardNameRef}
            />
            <Button
              variant="primary"
              type="submit"
              size="sm"
              className="d-block w-100 mt-2"
              onClick={handleCreate}
            >
              Create Board
            </Button>
          </Form>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CreateNewBoard;
