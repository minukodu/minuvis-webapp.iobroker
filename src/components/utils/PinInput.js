import React from "react";
import { Dialog, Input, List, ListItem, Button } from "react-onsenui";
import Title from "../widgets/Title";

export default function PinInput(props) {

  // if (props.show === false) {
  //   return null;
  // }

  return (
    <Dialog
      onCancel={props.onCancel}
      isOpen={props.show}
      visible={props.show}
      cancelable={false}
      isCancelable={false}
    >
      <Title
        title={"enter Pin"}
      />
      <List>
        <ListItem className="PinInput">
          <div className="center">
            <Input
              value=""
              type="password"
              maxlength="4"
              size="4"
              onChange={props.onChange}
              onKeyPress={props.onKeyPress}
            ></Input>
          </div>
        </ListItem>
        <ListItem className="buttons">
          <div className="left">
            <Button>
              Ok
            </Button>
          </div>
          <div className="center">
          </div>
          <div className="right">
            <Button>
              Esc
            </Button>
          </div>
        </ListItem>
      </List>
    </Dialog>
  );
}

