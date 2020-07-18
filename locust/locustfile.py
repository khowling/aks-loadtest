import random
import resource
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    wait_time = between(5, 9)
    print(resource.getrlimit(resource.RLIMIT_NOFILE))

    @task(3)
    def index_page(self):
        self.client.get("/")


    @task(9)
    def view_withkeepalive(self):
        item_id = random.randint(1, 10000)
        self.client.get(f"/customagent?name={item_id}", name="/customagent")
