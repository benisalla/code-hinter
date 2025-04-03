from crud import prof_crud, student_crud, exercise_crud, stud_prof_crud, stud_exe_crud

def seed_data():
    # Seed Professors if empty
    profs = prof_crud.get_all_profs()
    if not profs:
        print("Seeding professors...")
        prof1 = prof_crud.create_prof({"name": "Prof. Alice", "password": "alicepass"})
        prof2 = prof_crud.create_prof({"name": "Prof. Bob", "password": "bobpass"})
    else:
        # Use first two professors if they already exist
        prof1 = profs[0]
        prof2 = profs[1] if len(profs) > 1 else None

    # Seed Students if empty
    students = student_crud.get_all_students()
    if not students:
        print("Seeding students...")
        # Create 5 students for Prof. Alice
        for i in range(1, 6):
            student = student_crud.create_student({"name": f"Student {i} - A", "password": "pass"})
            # Create stud-prof association for professor 1 and this student
            stud_prof_crud.create_stud_prof({
                "student_id": student["id"],
                "prof_id": prof1["id"],
                "notes": "Initial assignment"
            })
        # Create 5 students for Prof. Bob (if prof2 exists)
        if prof2:
            for i in range(1, 6):
                student = student_crud.create_student({"name": f"Student {i} - B", "password": "pass"})
                stud_prof_crud.create_stud_prof({
                    "student_id": student["id"],
                    "prof_id": prof2["id"],
                    "notes": "Initial assignment"
                })

    # Seed Exercises if empty (only professor-created exercise data)
    exercises = exercise_crud.get_all_exercises()
    if not exercises:
        print("Seeding exercises...")
        # Prof. Alice creates 2 exercises
        ex1 = exercise_crud.create_exercise({
            "code_prof": "print('Hello from Prof. Alice, Exercise 1')",
            "concepts": "Basics",
            "id_prof": prof1["id"]
        })
        ex2 = exercise_crud.create_exercise({
            "code_prof": "print('Hello from Prof. Alice, Exercise 2')",
            "concepts": "Advanced",
            "id_prof": prof1["id"]
        })
        # Prof. Bob creates 2 exercises if available
        if prof2:
            ex3 = exercise_crud.create_exercise({
                "code_prof": "print('Hello from Prof. Bob, Exercise 1')",
                "concepts": "Basics",
                "id_prof": prof2["id"]
            })
            ex4 = exercise_crud.create_exercise({
                "code_prof": "print('Hello from Prof. Bob, Exercise 2')",
                "concepts": "Advanced",
                "id_prof": prof2["id"]
            })

    # Seed Student–Exercise Associations if empty
    stud_exes = stud_exe_crud.get_all_stud_exe()
    if not stud_exes:
        print("Seeding student-exercise associations...")
        # Retrieve all stud-prof associations to know which student belongs to which professor
        stud_prof_assocs = stud_prof_crud.get_all_stud_prof()
        all_students = student_crud.get_all_students()
        all_exercises = exercise_crud.get_all_exercises()

        # For each professor, assign each of their students to each exercise they created.
        # Prof. Alice:
        alice_students = [sp["student_id"] for sp in stud_prof_assocs if sp["prof_id"] == prof1["id"]]
        alice_exercises = [ex for ex in all_exercises if ex["id_prof"] == prof1["id"]]
        for exercise in alice_exercises:
            for stud_id in alice_students:
                stud_exe_crud.create_stud_exe({
                    "student_id": stud_id,
                    "exercise_id": exercise["id"],
                    "prof_id": prof1["id"],
                    "score": 0,
                    "status": "in_progress",
                    "code_submitted": None
                })

        # Prof. Bob:
        if prof2:
            bob_students = [sp["student_id"] for sp in stud_prof_assocs if sp["prof_id"] == prof2["id"]]
            bob_exercises = [ex for ex in all_exercises if ex["id_prof"] == prof2["id"]]
            for exercise in bob_exercises:
                for stud_id in bob_students:
                    stud_exe_crud.create_stud_exe({
                        "student_id": stud_id,
                        "exercise_id": exercise["id"],
                        "prof_id": prof2["id"],
                        "score": 0,
                        "status": "in_progress",
                        "code_submitted": None
                    })
    print("Seeding complete.")