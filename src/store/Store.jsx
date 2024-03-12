import {configureStore} from '@reduxjs/toolkit';
import TraineeDetilesDropdown from './trainee/TraineeDetilesDropdown';
import followUpDropDowns from './followup/FollowUpDropdowns';
import FeesDetiles from './feesDetials/FeesDetiles';
import LoginEmail from './loginAuth/LoginEmail';
import Attendence from './attendence/Attendence';

export default configureStore ({
  reducer: {
    traineeDropDowns: TraineeDetilesDropdown,
    saveAttendanceCourseName: Attendence,
    followUpDropDown: followUpDropDowns,
    feesDetiles: FeesDetiles,
    loginDetiles: LoginEmail,
  },
});
