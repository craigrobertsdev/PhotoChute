import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom'
import { GET_ME } from '../utils/queries';
import { useQuery } from "@apollo/client"



const User = () => {
  const {data} = useQuery(GET_ME)
  const [myGroups, setMyGroups] = useState([])
  const [friendsGroups, setFriendsGroups] = useState([])  
  console.log("first", data)
  useEffect(() => {
    console.log("second", data.me.groups)
    if (data?.groups)
    console.log("data", data)
    {const myUpdatedGroups = data?.me?.groups?.filter(group => group.groupOwner._id === data.me._id)
    setMyGroups(myUpdatedGroups)
    console.log(myGroups)}
  }, [data])
  // const friendsGroups = data.me.groups.filter(group => group.groupOwner._id !== data.me._id)
  return (
    <div className="flex-row justify-center mb-4">
      <div className='col-8'>
        <h2 className='altHeading'>My Groups</h2>
        <ul>
          {myGroups?.length >0 ? myGroups.map((group)=> (
            <Link to='/group' state={{groupId: group._id, serialisedGroupName: group.serialisedGroupName}}>{group.name}</Link>
          )):<div>loading...</div>}
        
        </ul>
      </div>
      <div className='col-8'>
        <h2 className='altHeading'>Friends Groups</h2>
        <ul>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

export default User;