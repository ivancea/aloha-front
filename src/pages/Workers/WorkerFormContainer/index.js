import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import CRUDContext from "../../../components/CRUDContext";
import { Formik } from "formik";
import * as Yup from "yup";
import WorkerForm from "../WorkerForm";
import WorkerImageDropzone from "../WorkerImageDropzone";

function WorkerFormContainer({
  worker,
  closeDialog,
  isModal,
  isInMap,
  onUnassign,
  workstation,
  workstationsCRUD
}) {
  const [workerPhoto, setWorkerPhoto] = useState(null);
  const initialValue = {
    userName: worker.userName || "",
    password: worker.password || "",
    name: worker.name || "",
    surname: worker.surname || "",
    email: worker.email || "",
    notes: worker.notes || ""
  };

  const requiredMessage = "Required field";

  const getPhoto = value => {
    setWorkerPhoto(value);
  };

  const WorkerSchema = Yup.object().shape({
    userName: Yup.string().required(requiredMessage),
    password: Yup.string().required(requiredMessage),
    name: Yup.string().required(requiredMessage),
    surname: Yup.string().required(requiredMessage),
    email: Yup.string()
      .email()
      .required(requiredMessage),
    notes: Yup.string()
  });

  const { workersCRUD } = useContext(CRUDContext);

  const onSubmit = values => {
    if (worker.id) {
      workersCRUD
        .update({
          ...values,
          id: worker.id,
          photoUrl: workerPhoto,
          workstationId: workstation ? workstation.id : null
        })
        .then(() => closeDialog());
    } else {
      workersCRUD
        .create({
          ...values,
          photoUrl: workerPhoto,
          workstationId: workstation ? workstation.id : null
        })
        .then(worker => {
          if (workstation && workstation.id) {
            workstationsCRUD
              .update({
                ...workstation,
                workerId: worker.id
              })
              .then(() => closeDialog());
          } else {
            closeDialog();
          }
        });
    }
  };

  return (
    <>
      <div>
        <WorkerImageDropzone onDrop={getPhoto} workerPhotoId={worker.photoId} />
      </div>
      <Formik
        initialValues={initialValue}
        validationSchema={WorkerSchema}
        onSubmit={onSubmit}
      >
        {props => (
          <WorkerForm
            {...props}
            closeDialog={closeDialog}
            isModal={isModal}
            isInMap={isInMap}
            onUnassign={onUnassign}
            isNewWorker={!Boolean(worker && worker.id)}
          />
        )}
      </Formik>
    </>
  );
}

WorkerFormContainer.propTypes = {
  worker: PropTypes.object.isRequired,
  closeDialog: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
  isInMap: PropTypes.bool,
  onUnassign: PropTypes.func,
  workstation: PropTypes.object,
  workstationsCRUD: PropTypes.object
};

export default WorkerFormContainer;
