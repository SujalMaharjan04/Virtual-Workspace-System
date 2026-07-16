import { create } from "zustand";

const useTaskStore = create(
    (set) => ({
        tasks: [],
            // [
            //     {
            //         id,
            //         title: task,
            //         description: description,
            //         priority,
            //         status,
            //         assigned_by: {
            //             name,
            //             id,
            //         },
            //         assigned_to: {
            //             name,
            //             id
            //         },
            //         deadline,
            //         created_at,
            //         updated_at,
            //     }
            // ]
        setTask: (tasks) => set({tasks}),

        addTask: (task) => set((state) => ({
            tasks: [...state.tasks, task]
        })),


        updateTask: (updatedTask) => set((state) => ({
            tasks: state.tasks.map((task) => 
            task.task_id === updatedTask.task_id ? updatedTask : task)
        })),

        removeTask: (id) => {
            set((state) => ({
                tasks: state.tasks.filter((task) => task.task_id !== id)
            }) )

            
        }
    })
)

export default useTaskStore