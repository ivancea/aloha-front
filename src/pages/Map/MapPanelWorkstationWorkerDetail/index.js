import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import "../../../hooks/useClickOutside";
import Confirm from "../../../components/Confirm";
import useClickOutside from "../../../hooks/useClickOutside";
import WorkerDialog from "../../Workers/WorkerDialog";

export function MapPanelWorkstationWorkerDetail(props) {
  const { close, workstation, assignedWorker, workstationsCRUD } = props;

  const [isConfirmOpened, setIsConfirmOpened] = useState(false);

  const ref = useRef(null);
  useClickOutside(ref, () => close());

  const unnasign = () => {
    const workstationToUpdate = { ...workstation, workerId: null };
    workstationsCRUD.update(workstationToUpdate);
    close();
  };

  const deleteWorkstation = () => {
    workstationsCRUD.del(workstation.id);
    close();
  };

  const closeConfirm = () => {
    setIsConfirmOpened(false);
  };

  return (
    <>
      {isConfirmOpened ? (
        <Confirm
          isActive={isConfirmOpened}
          onConfirm={deleteWorkstation}
          onCancel={() => closeConfirm()}
          title="Delete workstation"
          content={`Are you sure you want to delete the workstation?`}
        />
      ) : (
        <WorkerDialog
          worker={assignedWorker}
          closeDialog={close}
          isActive={!isConfirmOpened}
          onUnassign={unnasign}
          isInMap
        />
      )}
    </>
  );
}

MapPanelWorkstationWorkerDetail.propTypes = {
  close: PropTypes.func.isRequired,
  workstation: PropTypes.object.isRequired,
  assignedWorker: PropTypes.object.isRequired,
  workstationsCRUD: PropTypes.object.isRequired
};

export default MapPanelWorkstationWorkerDetail;
