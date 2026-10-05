import sys
import json
def predict_career(answers):
    categories = ["Engineering", "Medical", "Law", "Aviation", "Arts"]
    scores = {cat: 0 for cat in categories}
    for i, ans in enumerate(answers):
        if ans == "yes":
            scores[categories[i % len(categories)]] += 1
    predicted_career = max(scores, key=scores.get)
    print(predicted_career)
if __name__ == "__main__":
    answers = json.loads(sys.argv[1])
    predict_career(answers)
