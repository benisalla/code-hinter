export const DEFAULT_CONCEPTS = `1. Concept of a class.
2. Concept of private variables inside the class.
3. Concept of class attributes.
4. Concept of types in Python.`;

export const DEFAULT_PR_CODE = `class Person:
    _count = 0 

    def __init__(self, name: str, age: int):
        self.__name = name  
        self.__age = age    
        Person._count += 1   

    def get_info(self) -> str:
        return f"Name: {self.__name}, Age: {self.__age}"
`

export const DEFAULT_ST_CODE = `class Person:
    total_people = 0  # Renamed to be more descriptive

    def __init__(self, person_name: str, person_age: int):
        self.person_name = person_name  # Changed variable names to be more verbose
        self.person_age = person_age
        Person.total_people += 1  # Incrementing a differently named class variable
    
    def describe(self) -> str:
        # Changed method name from get_info to describe for variety
        info = "Person details - "  # Adding a prefix to the output for more context
        info += f"Name: {self.person_name}, Age: {self.person_age}"
        return info
`