import UserHome from "./UserHome.js";
import ManagerHome from "./ManagerHome.js";
import AdminHome from "./AdminHome.js";


export default {
    template:`<div>
    <UserHome v-if="userRole=='user'"/>
    <AdminHome v-if="userRole=='admin'" />
    <ManagerHome v-if="userRole=='manager'" />
    </div>`,
    data() {
        return {
            userRole: localStorage.getItem('role'),
        };
    },
    components:{
        UserHome,
        ManagerHome,
        AdminHome,
    }
}