import api from "../api"

/**공모전 목록 조회 API 호출 */
const readProjectApi = async() => {
try{
    const response = await api.get('/projects')
    console.log(response.data)
    return response.data
    } catch(err){
    throw err
        }
}

export default readProjectApi