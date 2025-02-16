import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SemesterSchedulePage.scss";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { IoArrowBack } from "react-icons/io5";

const URL = import.meta.env.VITE_BACKEND_URL;

// Generate time slots from 7:00 to 22:00 (1-hour increments)
const timeSlots = Array.from({ length: 16 }, (_, i) => `${7 + i}:00`);

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const subjectColors = {
  English: "#4A90E2",
  Science: "#1ABC9C",
  Math: "#E74C3C",
  Coding: "#9B59B6",
};

function SemesterSchedulePage() {
  const { semesterId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [semesterName, setSemesterName] = useState("");

  useEffect(() => {
    const fetchSemesterData = async () => {
      try {
        const semesterRes = await axios.get(`${URL}/semesters/${semesterId}`);
        setSemesterName(semesterRes.data.name);

        const classRes = await axios.get(
          `${URL}/semesters/${semesterId}/classes`
        );
        setClasses(classRes.data);
      } catch (error) {
        console.error("Error fetching semester data:", error);
      }
    };

    fetchSemesterData();
  }, [semesterId]);

  const convertTimeToMinutes = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + (minute || 0);
  };

  const findClassesForDay = (day) => {
    return classes.filter((cls) => cls.schedule.some((s) => s.day === day));
  };

  const calculateTopPosition = (startTime) => {
    const minutes = convertTimeToMinutes(startTime) % 60;
    return `${(minutes / 60) * 100}%`; // Offset within the time slot
  };

  const calculateHeight = (startTime, endTime) => {
    const duration =
      convertTimeToMinutes(endTime) - convertTimeToMinutes(startTime);
    return `${(duration / 60) * 100}%`; // Convert duration into percentage height
  };

  return (
    <div className="content semester-schedule">
      <Breadcrumbs />
      <div className="title">
        <div className="title-back">
          <IoArrowBack
            className="back-arrow"
            onClick={() => navigate(`/semesters/${semesterId}/classes`)}
          />
          <h2 className="class-title">{semesterName} - Weekly Schedule</h2>
        </div>
      </div>

      <div className="schedule-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Time</th>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="time-slot">{time}</td>
                {daysOfWeek.map((day) => {
                  const classesForThisSlot = findClassesForDay(day).filter(
                    (cls) => {
                      const classStart = convertTimeToMinutes(
                        cls.schedule.find((s) => s.day === day).start_time
                      );
                      const slotStart = convertTimeToMinutes(time);
                      return (
                        classStart >= slotStart && classStart < slotStart + 60
                      );
                    }
                  );

                  const classCount = classesForThisSlot.length;
                  const classWidth =
                    classCount > 0 ? `${100 / classCount}%` : "100%"; // Dynamic width

                  return (
                    <td key={day} className="schedule-cell">
                      {classesForThisSlot.map((cls, index) => {
                        const { start_time, end_time } = cls.schedule.find(
                          (s) => s.day === day
                        );
                        return (
                          <div
                            key={cls.id}
                            className="class-item"
                            style={{
                              backgroundColor:
                                subjectColors[cls.subject] || "#4c8bf5",
                              height: calculateHeight(start_time, end_time),
                              position: "absolute",
                              top: calculateTopPosition(start_time),
                              width: classWidth,
                              left: `${(100 / classCount) * index}%`,
                            }}
                          >
                            <p className="class-title">{cls.class_title}</p>
                            <p className="class-teacher">
                              {cls.teacher_first_name} {cls.teacher_last_name}
                            </p>
                            <p className="class-time">
                              {start_time} - {end_time}
                            </p>
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SemesterSchedulePage;
