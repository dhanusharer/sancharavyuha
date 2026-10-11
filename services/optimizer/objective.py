class DispatchObjectiveFunction:
    """Formulates cost function: Cost = alpha * WaitTime + beta * FuelCost"""
    def __init__(self, alpha: float = 0.60, beta: float = 0.40):
        self.alpha = alpha
        self.beta = beta

    def calculate_cost(self, wait_time_mins: float, fuel_cost_liters: float) -> float:
        return (self.alpha * wait_time_mins) + (self.beta * fuel_cost_liters)
