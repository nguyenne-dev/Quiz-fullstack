'use client';
import { useEffect, useState } from "react";
import { getSubmission } from "../../../services/submissionService";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Grow
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import './LichSuLam.css';
import { useRouter } from "next/navigation";

function LichSuLam() {
  const [dataGet, setDataGet] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchApi = async () => {
      const result = await getSubmission();
      setDataGet(result);
      console.log(result)
    };
    fetchApi();
  }, []);

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const seconds = Math.floor(diff / 1000);
    return `${seconds} giây`;
  };

  return (
    <Box className="history-container">
      <Typography variant="h5" align="center" gutterBottom className="title">
        📘 Lịch sử làm bài
      </Typography>

      <Grid container spacing={3}>
        {dataGet.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Grow in timeout={500}>
              <Card className="history-card" onClick={() => router.push(`/result?id=${item._id}`)}>
                <CardContent>
                  <Typography className="topic-title">
                    {item.topicId?.title}
                  </Typography>

                  <Typography className="info-text">
                    <CheckCircleIcon fontSize="small" color="success" />
                    Số câu đúng: <strong>{item.score}/{item.totalQuestions}</strong>
                  </Typography>

                  <Typography className="info-text">
                    <AccessTimeIcon fontSize="small" color="info" />
                    Thời gian làm: {getDuration(item.startedAt, item.submittedAt)}
                  </Typography>

                  <Typography className="info-text">
                    <AssignmentTurnedInIcon fontSize="small" />
                    Bắt đầu: {new Date(item.startedAt).toLocaleString()}
                  </Typography>

                  <Typography className="info-text">
                    <AssignmentTurnedInIcon fontSize="small" />
                    Nộp bài: {new Date(item.submittedAt).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default LichSuLam;
