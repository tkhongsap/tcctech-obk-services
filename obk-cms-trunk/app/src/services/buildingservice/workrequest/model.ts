export interface IWorkRequest {
  id: string
  issue: string
  author: string
  status: string
  datetime: string
  location: string
  problemtype: string
  feedbackcode: string
  description: string
  image: string
  authorname: string
  email: string
  phonenumber: string
}

export interface ICreateWorkRequest {
  fromFeeedbackId: string
  operatedBy: string
  assignedTo: string
}
