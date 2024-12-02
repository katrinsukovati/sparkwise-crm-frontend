import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { IoClose } from "react-icons/io5";

const URL = import.meta.env.VITE_BACKEND_URL;

const StudentModal = ({
  show,
  handleClose,
  student,
  mode,
  refreshStudents,
}) => {
  const initialFormState = {
    first_name: "",
    last_name: "",
    email: "",
    grade: "",
    date_of_birth: "",
    additional_notes: "",
    enrollments: [],
  };

  // set all the necessary states
  const [form, setForm] = useState(initialFormState);
  const [classOptions, setClassOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [parentInfo, setParentInfo] = useState({
    parent_first_name: "",
    parent_last_name: "",
    parent_email: "",
    parent_phone: "",
  });

  useEffect(() => {
    // get all the classes  to use in the drop down to select class enrollments
    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${URL}/classes`);
        const options = response.data.map((cls) => ({
          value: cls.id,
          label: `${cls.class_title} (${cls.semester_name})`,
        }));
        setClassOptions(options);
      } catch (error) {
        toast.error("Error fetching classes. Please try again.");
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, []);

  // this is for the parent dropdown, only in add mode
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await axios.get(`${URL}/clients`);
        const options = response.data.map((parent) => ({
          value: parent.id,
          label: `${parent.parent_first_name} ${parent.parent_last_name} (${parent.parent_email})`,
        }));
        setParentOptions(options);
      } catch (error) {
        toast.error("Error fetching parents. Please try again.");
        console.error("Error fetching parents:", error);
      }
    };

    if (mode === "add") {
      fetchParents();
    }
  }, [mode]);

  useEffect(() => {
    // get the selected students details
    const fetchStudentDetails = async () => {
      if (show && mode === "edit" && student) {
        try {
          const studentResponse = await axios.get(
            `${URL}/students/${student.student_id}`
          );

          // get all the classes that they are enrolled in
          const enrollmentsResponse = await axios.get(
            `${URL}/class-enrollments/student/${student.student_id}`
          );

          const enrollments = enrollmentsResponse.data.map((enrollment) => ({
            value: enrollment.class_id,
            label: `${enrollment.class_title} (${enrollment.semester_name})`,
          }));

          // set the form based on their current information
          setForm({
            first_name: studentResponse.data.first_name || "",
            last_name: studentResponse.data.last_name || "",
            email: studentResponse.data.email || "",
            grade: studentResponse.data.grade || "",
            date_of_birth:
              studentResponse.data.date_of_birth?.split("T")[0] || "",
            additional_notes: studentResponse.data.additional_notes || "",
            enrollments,
          });

          // set parent info based on their parent
          setParentInfo({
            parent_first_name: studentResponse.data.parent_first_name || "",
            parent_last_name: studentResponse.data.parent_last_name || "",
            parent_email: studentResponse.data.parent_email || "",
            parent_phone: studentResponse.data.parent_phone || "",
          });
        } catch (error) {
          toast.error("Error fetching student details.");
          console.error("Error fetching student details:", error);
        }
        // if in edit mode, the initial form is empty
      } else if (show && mode === "add") {
        setForm(initialFormState);
        setParentInfo({
          parent_first_name: "",
          parent_last_name: "",
          parent_email: "",
          parent_phone: "",
        });
      }
    };

    fetchStudentDetails();
  }, [show, mode, student]);

  // handle all changes made to the form - everytime the user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // handle everytime a change is made to the students enrolled courses
  const handleEnrollmentChange = (selectedOptions) => {
    setForm((prev) => ({
      ...prev,
      enrollments: selectedOptions || [],
    }));
  };

  // handle deleteing a student
  const handleDelete = async () => {
    try {
      if (student?.student_id) {
        const response = await axios.delete(
          `${URL}/students/${student.student_id}`
        );
        if (response.status === 200) {
          toast.success(
            `Successfully deleted student: ${student.first_name} ${student.last_name}`
          );
          refreshStudents();
          handleClose();
        } else {
          toast.error("Failed to delete student. Please try again.");
        }
      } else {
        toast.error("No student selected for deletion.");
      }
    } catch (error) {
      toast.error("Error deleting student. Please try again.");
      console.error("Error deleting student:", error);
    }
  };

  // handle saving a new student or exisitng student based on the mode (either 'add' or 'edit')
  const handleSave = async () => {
    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.email.trim() ||
      !form.grade.trim() ||
      !form.date_of_birth.trim() ||
      (mode === "add" && !form.parent_id)
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        grade: form.grade,
        date_of_birth: form.date_of_birth,
        additional_notes: form.additional_notes,
        ...(mode === "add" && { parent_id: form.parent_id }),
      };

      if (mode === "add") {
        const response = await axios.post(`${URL}/students`, payload);
        const studentId = response.data.id;

        if (form.enrollments.length > 0) {
          for (const enrollment of form.enrollments) {
            await axios.post(`${URL}/class-enrollments`, {
              student_id: studentId,
              class_id: enrollment.value,
            });
          }
        }

        toast.success("Student added successfully!");
      } else if (mode === "edit" && student?.student_id) {
        await axios.put(`${URL}/students/${student.student_id}`, payload);

        const currentEnrollmentsResponse = await axios.get(
          `${URL}/class-enrollments/student/${student.student_id}`
        );

        const currentEnrollments = currentEnrollmentsResponse.data;

        const currentEnrollmentIds = currentEnrollments.map((e) => e.class_id);
        const newEnrollmentIds = form.enrollments.map((e) => e.value);

        const enrollmentsToAdd = newEnrollmentIds.filter(
          (id) => !currentEnrollmentIds.includes(id)
        );
        const enrollmentsToRemove = currentEnrollments.filter(
          (e) => !newEnrollmentIds.includes(e.class_id)
        );

        // add new enrollments
        for (const classId of enrollmentsToAdd) {
          await axios.post(`${URL}/class-enrollments`, {
            student_id: student.student_id,
            class_id: classId,
          });
        }

        // remove enrollments by id (must do it one by one)
        for (const enrollment of enrollmentsToRemove) {
          if (enrollment.enrollment_id) {
            console.log(`Removing Enrollment ID: ${enrollment.enrollment_id}`);
            await axios.delete(
              `${URL}/class-enrollments/${enrollment.enrollment_id}`
            );
          } else {
            console.error("Missing enrollment ID for removal", enrollment);
          }
        }

        toast.success("Student updated successfully!");
      }

      refreshStudents();
      handleClose();
    } catch (error) {
      toast.error("Error saving student. Please try again.");
      console.error("Error saving student:", error.response?.data || error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title style={{ fontSize: "1.4rem" }}>
            {mode === "add" ? "Add Student" : "Edit Student"}
          </Modal.Title>
          <IoClose onClick={handleClose} className="close-btn" />
        </Modal.Header>
        <Modal.Body style={{ fontSize: "0.85rem" }}>
          <Form>
            {/* Student Information */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Student email */}
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={{ padding: "0.25rem", fontSize: "0.85rem" }}
              />
            </Form.Group>

            {/* Grade and DOB */}
            <Row className="mb-2">
              <Col>
                <Form.Group>
                  <Form.Label>Grade</Form.Label>
                  <Form.Control
                    type="text"
                    name="grade"
                    value={form.grade}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                    style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Selecting parent */}
            {mode == "add" && (
              <Form.Group className="mb-3">
                <Form.Label>Select Parent</Form.Label>
                <Select
                  options={parentOptions}
                  onChange={(selectedOption) =>
                    setForm((prev) => ({
                      ...prev,
                      parent_id: selectedOption?.value,
                    }))
                  }
                  placeholder="Select a parent"
                  styles={{
                    control: (base) => ({
                      ...base,
                      fontSize: "0.85rem",
                      padding: "0.25rem",
                    }),
                  }}
                />
              </Form.Group>
            )}

            {/* Parent Information */}
            {mode == "edit" && (
              <fieldset disabled>
                <Row className="mb-2">
                  <Col>
                    <Form.Group>
                      <Form.Label>Parent Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={`${parentInfo.parent_first_name} ${parentInfo.parent_last_name}`}
                        style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col>
                    <Form.Group>
                      <Form.Label>Parent Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={parentInfo.parent_email}
                        style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Parent Phone</Form.Label>
                      <Form.Control
                        type="text"
                        value={parentInfo.parent_phone}
                        style={{ padding: "0.25rem", fontSize: "0.85rem" }}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </fieldset>
            )}

            {/* Additional Notes */}
            <Form.Group className="mb-2">
              <Form.Label>Additional Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="additional_notes"
                value={form.additional_notes}
                onChange={handleChange}
                style={{ padding: "0.25rem", fontSize: "0.85rem" }}
              />
            </Form.Group>

            {/* Enrollments */}
            <Form.Group className="mb-3">
              <Form.Label>Enrollments</Form.Label>
              <Select
                isMulti
                options={classOptions}
                value={form.enrollments}
                onChange={handleEnrollmentChange}
                styles={{
                  control: (base) => ({
                    ...base,
                    fontSize: "0.85rem",
                    padding: "0.25rem",
                  }),
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {mode === "edit" && (
            <Button
              variant="danger"
              onClick={handleDelete}
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              Delete Student
            </Button>
          )}
          <Button
            variant="primary"
            onClick={handleSave}
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            {mode === "add" ? "Add Student" : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentModal;
