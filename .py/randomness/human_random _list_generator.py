def query_user(num_lists=2, length=20, low=1, high=100):
    lists = []

    for list_num in range(num_lists):
        print(f"\n--- List {list_num + 1} ---")

        current_list = []

        while len(current_list) < length:
            try:
                number = int(input(f"Number {len(current_list)+1}/{length}: "))

                if low <= number <= high:
                    current_list.append(number)
                else:
                    print(f"Please enter a number between {low} and {high}.")

            except ValueError:
                print("Please enter a valid integer.")

        lists.append(current_list)

    return lists


if __name__ == "__main__":
    print(query_user(num_lists=1, length=500, low=1, high=5))
